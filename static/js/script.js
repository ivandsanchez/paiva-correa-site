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
