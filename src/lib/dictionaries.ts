const dictionaries = {
  en: {
    hero: {
      title: "Botanical Excellence Redefined",
      subtitle:
        "Experience clinical-grade papaya extracts and rare herbal formulations crafted by our specialist doctors for your holistic health.",
      cta: "Shop Collection",
    },
    features: {
      organic: {
        title: "100% Organic",
        description:
          "Sourced directly from certified organic farms, ensuring maximum purity and potency.",
      },
      tested: {
        title: "Lab Tested",
        description:
          "Every batch is rigorously third-party tested for quality, safety, and effectiveness.",
      },
      shipping: {
        title: "Free Shipping",
        description:
          "Enjoy free, carbon-neutral shipping on all orders over $50 worldwide.",
      },
    },
    newsletter: {
      title: "Get 20% Off Today",
      subtitle:
        "Join 50,000+ wellness seekers. Receive expert tips, clinical updates, and exclusive herbal offers directly to your inbox.",
      placeholderName: "Your name",
      placeholderPhone: "Your phone number",
      button: "Sign Me Up",
    },
  },
  fr: {
    hero: {
      title: "L'Excellence Botanique Redéfinie",
      subtitle:
        "Découvrez des extraits de papaye de qualité clinique et des formulations à base de plantes rares élaborées par nos médecins spécialistes pour votre santé holistique.",
      cta: "Acheter la Collection",
    },
    features: {
      organic: {
        title: "100% Biologique",
        description:
          "Provenant directement de fermes biologiques certifiées, garantissant une pureté et une puissance maximales.",
      },
      tested: {
        title: "Testé en Laboratoire",
        description:
          "Chaque lot est rigoureusement testé par des tiers pour la qualité, la sécurité et l'efficacité.",
      },
      shipping: {
        title: "Livraison Gratuite",
        description:
          "Profitez d'une livraison gratuite et neutre en carbone pour toutes les commandes de plus de 50 $ dans le monde entier.",
      },
    },
    newsletter: {
      title: "Obtenez 20% de Réduction Aujourd'hui",
      subtitle:
        "Rejoignez plus de 50 000 adeptes du bien-être. Recevez des conseils d'experts, des mises à jour cliniques et des offres exclusives directement dans votre boîte de réception.",
      placeholderName: "Votre nom",
      placeholderPhone: "Votre numéro de téléphone",
      button: "Inscrivez-moi",
    },
  },
};

export const getDictionary = (lang: "en" | "fr") =>
  dictionaries[lang] || dictionaries.en;
