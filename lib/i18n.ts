export type Lang = "pt" | "en";

export const translations = {
  pt: {
    // Header
    nav: {
      howItWorks: "Como funciona",
      benefits: "Vantagens",
      faq: "Perguntas",
      getStarted: "Começar agora",
      langToggle: "EN",
    },

    // Hero
    hero: {
      badge: "Tecnologia de moda inteligente",
      title1: "Roupas que",
      title2: "realmente",
      title3: "servem em você",
      subtitle:
        "Tire uma foto, o V-Clothes mede seu corpo automaticamente e recomenda apenas peças que vão caber perfeitamente. Chega de devoluções.",
      ctaPrimary: "Criar minha conta",
      ctaSecondary: "Ver como funciona",
      stat1Value: "98%",
      stat1Label: "de precisão nas medidas",
      stat2Value: "3x",
      stat2Label: "menos devoluções",
      stat3Value: "2 min",
      stat3Label: "para medir seu corpo",
    },

    // How it works
    howItWorks: {
      badge: "Simples assim",
      title: "3 passos para o look perfeito",
      subtitle:
        "Sem fita métrica, sem complicação. Só você, seu celular e roupas que servem.",
      steps: [
        {
          number: "01",
          title: "Tire uma foto",
          description:
            "Use qualquer câmera — celular, tablet ou computador. Nossa IA analisa sua silhueta com precisão.",
        },
        {
          number: "02",
          title: "Medimos seu corpo",
          description:
            "Em segundos, o sistema captura todas as suas medidas: busto, cintura, quadril, ombros e muito mais.",
        },
        {
          number: "03",
          title: "Receba recomendações",
          description:
            "Veja apenas roupas que vão servir em você. Filtre por estilo, cor ou ocasião.",
        },
      ],
    },

    // Benefits
    benefits: {
      badge: "Por que V-Clothes?",
      title: "A moda finalmente do seu lado",
      subtitle:
        "Criamos uma experiência de compra onde cada peça recomendada é feita para o seu corpo.",
      items: [
        {
          icon: "Ruler",
          title: "Medição por IA",
          description:
            "Nossa tecnologia extrai medidas corporais precisas a partir de fotos simples, sem nenhum equipamento especial.",
        },
        {
          icon: "Smartphone",
          title: "Em qualquer dispositivo",
          description:
            "Funciona no seu celular, tablet ou computador. Acesse de onde estiver, quando quiser.",
        },
        {
          icon: "ShieldCheck",
          title: "Privacidade garantida",
          description:
            "Suas fotos e medidas são protegidas com criptografia. Você controla seus dados a qualquer momento.",
        },
        {
          icon: "Flame",
          title: "Mapa de calor (em breve)",
          description:
            "Nossa próxima feature mostrará exatamente onde uma peça fica mais apertada ou folgada no seu corpo.",
        },
        {
          icon: "RefreshCw",
          title: "Zero devoluções",
          description:
            "Como cada recomendação é baseada nas suas medidas reais, as roupas chegam com o tamanho certo.",
        },
        {
          icon: "Building2",
          title: "Para empresas",
          description:
            "Oferecemos nossa tecnologia para marcas e e-commerces de moda integrarem diretamente em suas plataformas.",
        },
      ],
    },

    // Testimonials
    testimonials: {
      badge: "O que dizem sobre nós",
      title: "Recomendado por quem usa",
      items: [
        {
          name: "Ana Beatriz",
          role: "Cliente beta",
          text: "Finalmente comprei uma calça online e ela serviu perfeitamente na primeira vez. Nunca mais devolverei roupas.",
          stars: 5,
        },
        {
          name: "Carlos Mendes",
          role: "Usuário do app",
          text: "O processo de medição foi surpreendentemente rápido. Em 2 minutos o sistema já sabia meu tamanho exato.",
          stars: 5,
        },
        {
          name: "Larissa Fonseca",
          role: "Cliente beta",
          text: "Adoro que posso acessar pelo celular de qualquer lugar. As recomendações são incrivelmente precisas.",
          stars: 5,
        },
        {
          name: "Pedro Alves",
          role: "Usuário do app",
          text: "A ideia do mapa de calor vai revolucionar como compramos roupas. Mal posso esperar pela versão completa.",
          stars: 5,
        },
      ],
    },

    // FAQ
    faq: {
      badge: "Dúvidas frequentes",
      title: "Tudo que você quer saber",
      items: [
        {
          q: "Como o V-Clothes mede meu corpo por foto?",
          a: "Usamos inteligência artificial e visão computacional para analisar proporções, silhueta e pontos de referência do seu corpo. O sistema é treinado com milhares de medidas para garantir precisão.",
        },
        {
          q: "Preciso de uma câmera especial?",
          a: "Não! Qualquer câmera de celular, tablet ou computador funciona. Basta uma boa iluminação e seguir as instruções de posicionamento.",
        },
        {
          q: "Minhas fotos ficam salvas?",
          a: "Suas fotos são processadas e descartadas após a extração das medidas. Armazenamos apenas os dados numéricos das medidas, nunca as imagens.",
        },
        {
          q: "O sistema funciona para qualquer tipo de corpo?",
          a: "Sim! O V-Clothes foi desenvolvido para funcionar com toda diversidade de corpos — diferentes alturas, pesos e formas.",
        },
        {
          q: "O que é o mapa de calor?",
          a: "É uma feature futura que mostrará visualmente em qual parte do corpo uma roupa específica ficará mais justa ou folgada, antes mesmo de você comprá-la.",
        },
        {
          q: "Como funciona o plano para empresas?",
          a: "Oferecemos nossa tecnologia como API ou white-label para marcas e e-commerces integrarem à sua plataforma, mantendo todos os direitos sobre a tecnologia.",
        },
      ],
    },

    // Final CTA
    finalCta: {
      title: "Pronto para vestir o que realmente serve?",
      subtitle:
        "Junte-se à lista de espera e seja o primeiro a testar o V-Clothes.",
      placeholder: "Seu melhor e-mail",
      button: "Entrar na lista",
      disclaimer: "Sem spam. Você pode sair quando quiser.",
    },

    // Footer
    footer: {
      tagline: "Moda inteligente, caimento perfeito.",
      links: {
        product: "Produto",
        howItWorks: "Como funciona",
        benefits: "Vantagens",
        forCompanies: "Para empresas",
        company: "Empresa",
        about: "Sobre nós",
        contact: "Contato",
        legal: "Legal",
        privacy: "Privacidade",
        terms: "Termos de uso",
      },
      copyright: "© 2025 V-Clothes. Todos os direitos reservados.",
    },
  },

  en: {
    // Header
    nav: {
      howItWorks: "How it works",
      benefits: "Benefits",
      faq: "FAQ",
      getStarted: "Get started",
      langToggle: "PT",
    },

    // Hero
    hero: {
      badge: "Smart fashion technology",
      title1: "Clothes that",
      title2: "actually",
      title3: "fit you",
      subtitle:
        "Take a photo, V-Clothes automatically measures your body and recommends only pieces that will fit perfectly. No more returns.",
      ctaPrimary: "Create my account",
      ctaSecondary: "See how it works",
      stat1Value: "98%",
      stat1Label: "measurement accuracy",
      stat2Value: "3x",
      stat2Label: "fewer returns",
      stat3Value: "2 min",
      stat3Label: "to measure your body",
    },

    // How it works
    howItWorks: {
      badge: "That simple",
      title: "3 steps to the perfect look",
      subtitle:
        "No tape measure, no hassle. Just you, your phone, and clothes that fit.",
      steps: [
        {
          number: "01",
          title: "Take a photo",
          description:
            "Use any camera — phone, tablet, or computer. Our AI analyzes your silhouette with precision.",
        },
        {
          number: "02",
          title: "We measure your body",
          description:
            "In seconds, the system captures all your measurements: chest, waist, hips, shoulders and more.",
        },
        {
          number: "03",
          title: "Get recommendations",
          description:
            "See only clothes that will fit you. Filter by style, color, or occasion.",
        },
      ],
    },

    // Benefits
    benefits: {
      badge: "Why V-Clothes?",
      title: "Fashion finally on your side",
      subtitle:
        "We created a shopping experience where every recommended piece is made for your body.",
      items: [
        {
          icon: "Ruler",
          title: "AI Measurement",
          description:
            "Our technology extracts precise body measurements from simple photos, without any special equipment.",
        },
        {
          icon: "Smartphone",
          title: "Any device",
          description:
            "Works on your phone, tablet, or computer. Access from anywhere, anytime.",
        },
        {
          icon: "ShieldCheck",
          title: "Privacy guaranteed",
          description:
            "Your photos and measurements are protected with encryption. You control your data at any time.",
        },
        {
          icon: "Flame",
          title: "Heat map (coming soon)",
          description:
            "Our next feature will show exactly where a piece fits tighter or looser on your body.",
        },
        {
          icon: "RefreshCw",
          title: "Zero returns",
          description:
            "Since every recommendation is based on your real measurements, clothes arrive in the right size.",
        },
        {
          icon: "Building2",
          title: "For businesses",
          description:
            "We offer our technology to fashion brands and e-commerce stores to integrate directly into their platforms.",
        },
      ],
    },

    // Testimonials
    testimonials: {
      badge: "What they say about us",
      title: "Recommended by users",
      items: [
        {
          name: "Ana Beatriz",
          role: "Beta user",
          text: "I finally bought jeans online and they fit perfectly on the first try. No more returns ever again.",
          stars: 5,
        },
        {
          name: "Carlos Mendes",
          role: "App user",
          text: "The measurement process was surprisingly fast. In 2 minutes the system already knew my exact size.",
          stars: 5,
        },
        {
          name: "Larissa Fonseca",
          role: "Beta user",
          text: "I love that I can access it from my phone anywhere. The recommendations are incredibly accurate.",
          stars: 5,
        },
        {
          name: "Pedro Alves",
          role: "App user",
          text: "The heat map idea will revolutionize how we buy clothes. Can't wait for the full version.",
          stars: 5,
        },
      ],
    },

    // FAQ
    faq: {
      badge: "Frequently asked questions",
      title: "Everything you want to know",
      items: [
        {
          q: "How does V-Clothes measure my body from a photo?",
          a: "We use artificial intelligence and computer vision to analyze proportions, silhouette, and reference points on your body. The system is trained with thousands of measurements to ensure accuracy.",
        },
        {
          q: "Do I need a special camera?",
          a: "No! Any phone, tablet, or computer camera works. Just good lighting and following the positioning instructions.",
        },
        {
          q: "Are my photos saved?",
          a: "Your photos are processed and discarded after measurement extraction. We only store the numerical measurement data, never the images.",
        },
        {
          q: "Does the system work for any body type?",
          a: "Yes! V-Clothes was developed to work with all body diversity — different heights, weights, and shapes.",
        },
        {
          q: "What is the heat map?",
          a: "It's a future feature that will visually show which part of your body a specific piece of clothing will fit tighter or looser, before you even buy it.",
        },
        {
          q: "How does the business plan work?",
          a: "We offer our technology as an API or white-label for brands and e-commerce stores to integrate into their platform, while retaining all rights to the technology.",
        },
      ],
    },

    // Final CTA
    finalCta: {
      title: "Ready to wear what actually fits?",
      subtitle: "Join the waitlist and be the first to try V-Clothes.",
      placeholder: "Your best email",
      button: "Join the list",
      disclaimer: "No spam. You can leave whenever you want.",
    },

    // Footer
    footer: {
      tagline: "Smart fashion, perfect fit.",
      links: {
        product: "Product",
        howItWorks: "How it works",
        benefits: "Benefits",
        forCompanies: "For companies",
        company: "Company",
        about: "About us",
        contact: "Contact",
        legal: "Legal",
        privacy: "Privacy",
        terms: "Terms of use",
      },
      copyright: "© 2025 V-Clothes. All rights reserved.",
    },
  },
} as const;
