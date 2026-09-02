// Interactive Functions for Paiva e Corrêa Homepage

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }
// Dados das Sócias
const sociasData = {
    kamila: {
        name: "Kamila Paiva",
        role: "Sócia Fundadora",
        email: "kamila@paivaecorrea.com.br",
        phone: "+55 (11) 93286-1852",
        phonei: "5511932861852",
        img: "static/img/kamila.jpeg",
        bio: "Kamila Paiva é sócia fundadora do Paiva e Correa Advogados, graduada em 2010, possui sólida experiência em Direito Bancário, Regulatório Financeiro e Compliance, atua na assessoria preventiva, consultiva e no contencioso estratégico para instituições financeiras, meios de pagamento, empresas e pessoas físicas. É membra da Associação dos Advogados de São Paulo (AASP), das Comissões de Direito Bancário e de Direito do Consumidor da OAB/SP.",
        academic: [
            "Bacharel em Direito pela Universidade Bandeirante de São Paulo",
            "Pós-graduação em Direito e Processo Tributário pela Escola Paulista de Direito (EPD)"
        ],
        certifications: [
            "Governança Regulatória, Prevenção à Fraude e Anticorrupção — LEC",
            "Governança Regulatória e Cláusulas Contratuais — PUC",
            "Direito Financeiro, Proteção de Dados (LGPD) e Crimes Financeiros — PUC",
            "Direito Empresarial e Nova Lei de Falências — PUC",
            "Propriedade Intelectual para Startups — SEBRAE-SP",
            "Direito de Família e Sucessões — Escola Superior de Advocacia (ESA)"
        ]
    },
    karla: {
        name: "Karla Correa",
        role: "Sócia Fundadora",
        email: "karla@paivaecorrea.com.br",
        phone: "+55 (11) 96191-7900",
        phonei: "5511961917900",
        img: "static/img/karla.jpeg",
        bio: "Karla Correa é sócia fundadora do Paiva e Correa Advogados. Graduada em 2009, possui ampla bagagem na condução de causas complexas, destaca-se pela visão estratégica no contencioso e na consultoria preventiva. Sua atuação combina forte rigor técnico em demandas cíveis e empresariais com foco em desenvolvimento institucional e gestão estratégica de conflitos.",
        academic: [
            "Bacharel em Direito pela Pontifícia Universidade Católica / Nove de Julho",
            "Especialista em Direito Empresarial e Tributário",
            "Pós-graduada em Desenvolvimento Humano e Gestão Estratégica"
        ],
        certifications: [
            "Pós-Graduação em Desenvolvimento Humano e Gestão Estratégica",
            "Extensão em Planejamento Patrimonial e Sucessório",
            "Extensão em Direito Imobiliário e Regularização de Imóveis",
            "Capacitação em Responsabilidade Civil e Direito da Saúde (Erro Médico)"
        ]
    }
};

// Função global para abrir o modal
window.openSociaModal = function(key) {
    const modal = document.getElementById('sociaModal');
    const modalBody = document.getElementById('sociaModalBody');
    const data = sociasData[key];

    if (modal && modalBody && data) {
        const academicList = data.academic.map(item => `<li>${item}</li>`).join('');
        const certList = data.certifications.map(item => `<li>${item}</li>`).join('');

        modalBody.innerHTML = `
            <div class="profile-header">
                <img src="${data.img}" alt="${data.name}" class="profile-avatar">
                <div class="profile-meta">
                    <h2>${data.name}</h2>
                    <span class="subtitle">${data.role}</span>
                    <ul class="profile-contact-list">
                        <li><i class="fa-solid fa-envelope"></i> ${data.email}</li>
                        <li><i class="fa-solid fa-phone"></i>
                        <p><a href="https://wa.me/${data.phonei}?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20atendimento%20jur%C3%ADdico.%20Aguardarei%20o%20retorno%20da%20equipe." target="_blank" style="text-decoration: none; color: inherit;">
   ${data.phone}
</a></p>
                        
                        </li>
                               
                    </ul>
                </div>
            </div>

            <p class="profile-body-text">${data.bio}</p>

            <h3 class="profile-section-title">Formação Acadêmica</h3>
            <ul class="profile-list">
                ${academicList}
            </ul>

            <h3 class="profile-section-title">Certificações & Especializações</h3>
            <ul class="profile-list">
                ${certList}
            </ul>
        `;

        modal.style.display = 'flex';
    }
};

// Função global para fechar o modal
window.closeSociaModal = function() {
    const modal = document.getElementById('sociaModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// Listener global para fechar modais ao clicar fora
window.addEventListener('click', function(event) {
    const sociaModal = document.getElementById('sociaModal');
    if (event.target === sociaModal) {
        sociaModal.style.display = 'none';
    }
});
    // Search Drawer Toggle
    const searchBtn = document.getElementById('searchBtn');
    const searchDrawer = document.getElementById('searchDrawer');
    const searchClose = document.getElementById('searchClose');

    if (searchBtn && searchDrawer && searchClose) {
        searchBtn.addEventListener('click', () => {
            searchDrawer.style.display = 'block';
        });

        searchClose.addEventListener('click', () => {
            searchDrawer.style.display = 'none';
        });
    }

    // Animated Counter on Scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    window.addEventListener('scroll', () => {
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;

            if (sectionPos < screenPos && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    let count = 0;
                    const speed = target / 50;

                    const updateCount = () => {
                        count += speed;
                        if (count < target) {
                            stat.innerText = Math.ceil(count);
                            setTimeout(updateCount, 30);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCount();
                });
            }
        }
    });
});

// Close Security Alert Banner
function closeAlert() {
    const alert = document.getElementById('securityAlert');
    if (alert) {
        alert.style.display = 'none';
    }
}

// Data for Practice Area Modals
const practiceData = {
    administrativo: {
        title: "Direito Administrativo",
        content: `O escritório <strong>Paiva e Corrêa Advogados</strong> atua com proficiência na defesa dos interesses de seus clientes junto aos órgãos fiscalizadores, interventores no domínio econômico e de proteção ao consumidor (DPDC, CADE, ECAD, CONAR, INPI, PROCON, INMETRO, CETESB, Subprefeituras, etc.), com ênfase na impugnação de autuações.<br><br>
        Também prestamos suporte a fornecedores do Poder Público, assessorando em todas as etapas de licitações e contratos administrativos.`
    },
    contratual: {
        title: "Contratual e Societária",
        content: `Contempla a advocacia preventiva e a consultoria em organização societária e contratual: elaboração de atos societários (S/A, Limitadas, Holdings), M&A (fusões, cisões e incorporações), joint-ventures, contratos imobiliários e de propriedade intelectual.<br><br>
        Realizamos trabalhos de auditoria jurídica (<em>due diligence</em>) para avaliação de riscos e contingências corporativas.`
    },
    civel: {
        title: "Cível, Comercial e Consumidor",
        content: `Assessoria jurídica contenciosa e consultiva no desenvolvimento de estratégias de prevenção em conformidade com a legislação anticorrupção e códigos de conduta.<br><br>
        Acompanhamento de processos judiciais cíveis de grande complexidade, mediação e recuperação de haveres.`
    },
    constitucional: {
        title: "Direito Constitucional",
        content: `Consultoria em Direito Constitucional e questionamento da constitucionalidade de leis e normas em tribunais regionais e superiores, inclusive perante o Supremo Tribunal Federal (STF).`
    },
    trabalhista: {
        title: "Direito Trabalhista Empresarial",
        content: `Defesa e acompanhamento de processos trabalhistas em todas as instâncias judiciais. Atuação preventiva com foco na mitigação de riscos, auditorias internas de rotinas trabalhistas e negociação de acordos coletivos com sindicatos.`
    },
    tributaria: {
        title: "Direito Tributário",
        content: `Planejamento tributário estratégico para economia fiscal legal. Defesas administrativas de autos de infração, impugnações, mandados de segurança e embargos à execução fiscal perante órgãos federais, estaduais e municipais.`
    },
    penal: {
        title: "Penal Empresarial",
        content: `Assistência jurídica e representação de empresas e executivos nos âmbitos consultivo e preventivo, bem como na defesa em inquéritos policiais e ações penais relacionadas a crimes contra a ordem tributária, meio ambiente, consumo e fraudes.`
    }
};

// Open Practice Modal
function openPracticeModal(key) {
    const modal = document.getElementById('practiceModal');
    const modalBody = document.getElementById('modalBody');
    const data = practiceData[key];

    if (modal && modalBody && data) {
        modalBody.innerHTML = `<h3>${data.title}</h3><p>${data.content}</p>`;
        modal.style.display = 'flex';
    }
}

// Close Practice Modal
function closePracticeModal() {
    const modal = document.getElementById('practiceModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close Modal on Outside Click
window.onclick = function(event) {
    const modal = document.getElementById('practiceModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Form Handler
function handleFormSubmit(event) {
    event.preventDefault();
    alert('Obrigado pelo contato! Sua mensagem foi enviada com sucesso. A equipe do Paiva e Corrêa Advogados retornará em breve.');
    document.getElementById('contactForm').reset();
}