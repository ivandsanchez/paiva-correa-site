from datetime import datetime
import os
import re

from authlib.integrations.flask_client import OAuth
from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    url_for,
)
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import ImageUploadField
from flask_login import (
    LoginManager,
    UserMixin,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from flask_sqlalchemy import SQLAlchemy
from markupsafe import Markup
from slugify import slugify
from werkzeug.middleware.proxy_fix import ProxyFix

# ==========================================
# CONFIGURAÇÃO DO APP E DIRETÓRIOS
# ==========================================
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
app.config["SECRET_KEY"] = "sua-chave-secreta-super-segura-aqui"

# Diretório para upload de imagens de notícias
basedir = os.path.abspath(os.path.dirname(__file__))
IMAGE_UPLOAD_PATH = os.path.join(basedir, "static", "uploads", "noticias")
os.makedirs(IMAGE_UPLOAD_PATH, exist_ok=True)

# ==========================================
# CONFIGURAÇÃO DO GOOGLE OAUTH
# ==========================================
app.config["GOOGLE_CLIENT_ID"] = (
    "538343301808-00hudic7ov4cdoqnv7ovu6mlltl0lrdb.apps.googleusercontent.com"
)
app.config["GOOGLE_CLIENT_SECRET"] = "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"

oauth = OAuth(app)
google = oauth.register(
    name="google",
    client_id=app.config["GOOGLE_CLIENT_ID"],
    client_secret=app.config["GOOGLE_CLIENT_SECRET"],
    server_metadata_url=(
        "https://accounts.google.com/.well-known/openid-configuration"
    ),
    client_kwargs={"scope": "openid email profile"},
)

# Lista exclusiva de e-mails com acesso ao Painel Admin
EMAILS_PERMITIDOS = [
    "karla@paivaecorrea.com.br",
    "kamila@paivaecorrea.com.br",
    "ivandigosanchez@gmail.com",
]

db = SQLAlchemy(app)

# Configuração do Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login_admin"


# --- 1. MODELOS DE DADOS ---
class Usuario(db.Model, UserMixin):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(120), unique=True, nullable=False)
  nome = db.Column(db.String(120), nullable=True)


class Noticia(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  titulo = db.Column(db.String(200), nullable=False)
  slug = db.Column(db.String(250), unique=True, nullable=False)
  resumo = db.Column(db.Text, nullable=False)
  conteudo = db.Column(db.Text, nullable=False)
  imagem = db.Column(db.String(250), nullable=True)
  data_publicacao = db.Column(db.DateTime, default=datetime.utcnow)
  publicado = db.Column(db.Boolean, default=True)

  def __repr__(self):
    return f"<Noticia {self.titulo}>"


@app.template_filter("formatar_paragrafos")
def formatar_paragrafos(texto):
  if not texto:
    return ""
  if "<p>" in texto or "<br" in texto:
    return Markup(texto)

  paragrafos = [p.strip() for p in re.split(r"\r?\n+", texto) if p.strip()]
  html_formatado = "".join(f"<p>{p}</p>" for p in paragrafos)
  return Markup(html_formatado)


@login_manager.user_loader
def load_user(user_id):
  return db.session.get(Usuario, int(user_id))


with app.app_context():
  db.create_all()


# --- 2. CONTROLE DE ACESSO AO ADMIN ---
class SecureModelView(ModelView):

  def is_accessible(self):
    return (
        current_user.is_authenticated
        and current_user.email in EMAILS_PERMITIDOS
    )

  def inaccessible_callback(self, name, **kwargs):
    return redirect(url_for("login_admin"))


class SecureAdminIndexView(AdminIndexView):

  def is_accessible(self):
    return (
        current_user.is_authenticated
        and current_user.email in EMAILS_PERMITIDOS
    )

  def inaccessible_callback(self, name, **kwargs):
    return redirect(url_for("login_admin"))

  @expose("/")
  def index(self):
    if not self.is_accessible():
      return self.inaccessible_callback("index")
    return redirect(url_for("noticia.index_view"))


admin = Admin(app, name="Painel de Notícias", index_view=SecureAdminIndexView())


class NoticiaAdminView(SecureModelView):
  column_list = ("titulo", "slug", "data_publicacao", "publicado")
  form_excluded_columns = ["slug"]
  form_extra_fields = {
      "imagem": ImageUploadField(
          "Imagem de Capa",
          base_path=IMAGE_UPLOAD_PATH,
          url_relative_path="uploads/noticias/",
          allow_overwrite=True,
      )
  }

  def on_model_change(self, form, model, is_created):
    if model.titulo:
      model.slug = slugify(model.titulo)
    super().on_model_change(form, model, is_created)

  def _url_formatter(view, context, model, name):
    if model.slug:
      link = url_for("detalhe_noticia", slug=model.slug, _external=True)
      return Markup(
          f'<a href="{link}" target="_blank" style="color: #2b6cb0;'
          f' text-decoration: underline;">{link} ↗</a>'
      )
    return ""

  column_formatters = {"slug": _url_formatter}
  column_labels = {
      "titulo": "Título da Notícia",
      "slug": "URL da Notícia",
      "data_publicacao": "Data de Publicação",
      "publicado": "Publicado",
  }
  column_sortable_list = ("titulo", "slug", "data_publicacao", "publicado")


admin.add_view(
    NoticiaAdminView(Noticia, db.session, name="Publicações e Notícias")
)


# --- 3. ROTAS DE AUTENTICAÇÃO VIA GOOGLE ---
@app.route("/admin/login")
def login_admin():
  if current_user.is_authenticated and current_user.email in EMAILS_PERMITIDOS:
    return redirect(url_for("admin.index"))
  return render_template("admin_login.html")


@app.route("/auth/google")
def google_login():
  redirect_uri = url_for("google_callback", _external=True)
  return google.authorize_redirect(redirect_uri)


@app.route("/auth/google/callback")
def google_callback():
  try:
    token = google.authorize_access_token()
    user_info = token.get("userinfo")
    if not user_info:
      user_info = google.parse_id_token(token, None)

    email = user_info.get("email")
    nome = user_info.get("name")

    if email in EMAILS_PERMITIDOS:
      user = Usuario.query.filter_by(email=email).first()
      if not user:
        user = Usuario(email=email, nome=nome)
        db.session.add(user)
        db.session.commit()

      login_user(user)
      return redirect(url_for("admin.index"))
    else:
      flash(
          "Acesso negado: Este e-mail não tem permissão para acessar o painel.",
          "danger",
      )
      return redirect(url_for("login_admin"))

  except Exception as e:
    flash(f"Erro na autenticação com o Google: {str(e)}", "danger")
    return redirect(url_for("login_admin"))


@app.route("/admin/logout")
@login_required
def logout_admin():
  logout_user()
  return redirect(url_for("login_admin"))


# --- 4. ROTAS PÚBLICAS DO SITE ---
@app.route("/")
def home():
  noticias_recentes = (
      Noticia.query.filter_by(publicado=True)
      .order_by(Noticia.data_publicacao.desc())
      .limit(5)
      .all()
  )
  return render_template("index.html", noticias=noticias_recentes)


@app.route("/noticias-e-publicacoes/")
def lista_noticias():
  noticias = (
      Noticia.query.filter_by(publicado=True)
      .order_by(Noticia.data_publicacao.desc())
      .all()
  )
  return render_template("noticias.html", noticias=noticias)


@app.route("/informativos/<slug>/")
def detalhe_noticia(slug):
  noticia = Noticia.query.filter_by(slug=slug, publicado=True).first_or_404()
  return render_template("noticia_detalhe.html", noticia=noticia)


@app.route("/politica-de-privacidade")
def politica_privacidade():
  return render_template("politica-de-privacidade.html")


@app.route("/sitemap.xml")
def sitemap():
  return send_from_directory(".", "sitemap.xml", mimetype="application/xml")


@app.route("/robots.txt")
def robots():
  return send_from_directory(".", "robots.txt", mimetype="text/plain")


if __name__ == "__main__":
  port = int(os.environ.get("PORT", 8080))
  app.run(host="0.0.0.0", port=port)