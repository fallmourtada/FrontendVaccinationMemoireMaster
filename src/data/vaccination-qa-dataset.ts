// Vaccination Q&A Dataset - Complete Professional Version

export interface QAItem {
  id: string;
  question: string;
  response: string;
  keywords?: string[];
  category?: 'general' | 'vaccines' | 'effects' | 'safety' | 'healthcare' | 'importance' | 'risk' | 'calendar' | 'pregnancy' | 'children' | 'myths';
}

export const vaccinationQADataset: QAItem[] = [
  // ====== QUESTIONS BASIQUES ======
  {
    id: 'greeting',
    question: 'Bonjour',
    keywords: ['bonjour', 'salut', 'hello', 'hi', 'coucou'],
    response: '👋 **Bienvenue dans Vaccimed!**\n\nJe suis votre assistant spécialisé en vaccination. Je peux vous aider avec:\n\n✅ Calendrier vaccinal complet\n✅ Vaccins pour enfants, adultes, femmes enceintes\n✅ Effets secondaires et sécurité\n✅ Mythes vs science\n✅ Rôle des agents de santé\n✅ FAQs vaccination\n\n**Posez votre question!** 🎯',
    category: 'general',
  },

  // ====== IMPORTANCE DE LA VACCINATION ======
  {
    id: 'why_vaccinate',
    question: 'Pourquoi vacciner?',
    keywords: ['pourquoi', 'importance', 'raison', 'utilite'],
    response: '💉 **IMPORTANCE CRUCIALE DE LA VACCINATION:**\n\n**Impact Global:**\n• Sauve 2-3 millions de vies/an\n• Prévient 4-5 millions de décès annuels\n• Éradiqué la variole (98 millions vies/an)\n• Éradiqué la polio en 99% des régions\n\n**Protection Individuelle:**\n✓ Crée immunité durable (souvent à vie)\n✓ Réduit sévérité si infection\n✓ Évite complications graves\n✓ Renforce système immunitaire\n\n**Protection Collective (Immunité de Groupe):**\n• 85-95% vaccinés = maladie disparaît\n• Protège nourrissons < 2 mois\n• Protège immunodéprimés\n• Bloque transmission\n\n**Économiquement:**\n💰 1€ de vaccin = 16€ économisés\n💰 Moins d\'hospitalisations\n💰 Travail/école non interrompus\n💰 Productivité maintenue\n\n**Conclusion:** Vaccination = **investissement santé** #1 ✨',
    category: 'importance',
  },

  {
    id: 'vaccination_history',
    question: 'Quelle est l\'histoire de la vaccination?',
    keywords: ['histoire', 'historique', 'passé', 'origins', 'jenner'],
    response: '📚 **HISTOIRE REMARQUABLE DE LA VACCINATION:**\n\n**1796 - Edward Jenner (Naissance):**\n• Médecin anglais observe traite lait → immunité variole\n• Vaccine garçon 8 ans (succès!)\n• Variole était tueur #1 (30% mortalité)\n• Jenner appelé "père vaccination"\n\n**1901-1950 - Expansion:**\n• Diphtérie vaccine → 50 000 décès → quasi 0\n• Polio vaccine (1954) → 350 000 paralysies → 1000 cas/an\n• Rougeole vaccine (1963) → 4 millions décès → 100 000\n\n**1980 - SUCCÈS ULTIME:**\n• Variole éradiquée mondialement! 🎉\n• Seule maladie humaine complètement éliminée\n• Sauvé 300 millions de vies!\n\n**Aujourd\'hui:**\n• 5+ milliards de vaccins/an administrés\n• Prévient 4-5 millions de décès/an\n• Vaccination = plus grande réussite santé publique\n\n**Sans vaccination = retour maladies mortelles!** ⚠️',
    category: 'importance',
  },

  {
    id: 'vaccination_advantages',
    question: 'Quels sont les avantages de la vaccination?',
    keywords: ['avantages', 'benefices', 'points positifs', 'profit'],
    response: '🌟 **AVANTAGES MAJEURS DE LA VACCINATION:**\n\n**1. PROTECTION MÉDICALE:**\n✅ Immunité contre maladies graves\n✅ Réduction 95-99% du risque infection\n✅ Évite complications (paralysie, surdité, cécité)\n✅ Réduit sévérité si infection malgré vaccin\n\n**2. PROTECTION COLLECTIVE:**\n✅ Protège bébés < 2 mois\n✅ Protège malades immunodéprimés\n✅ Protège non-vaccinables (allergie)\n✅ Éradique maladie (ex: variole)\n\n**3. AVANTAGES ÉCONOMIQUES:**\n✅ 1€ vaccin = 16€ économisés (médical)\n✅ Moins hospitalizations\n✅ Moins jours absence travail/école\n✅ Plus de productivité\n✅ Économie naionale +1000x ROI\n\n**4. AVANTAGES SOCIAUX:**\n✅ École libre de l\'épidémie\n✅ Travail ininterrompu\n✅ Famille unie (pas quarantaine)\n✅ Communauté saine\n\n**5. AVANTAGES À LONG TERME:**\n✅ Éradication possible (polio next?)\n✅ Générations saines\n✅ Moins maladies chroniques\n✅ Espérance vie +10-20 ans en zones vaccination\n\n**Résumé:** Vaccination = **Protection complète + Économie + Bien-être collectif** 🎯',
    category: 'importance',
  },

  {
    id: 'vaccination_disadvantages',
    question: 'Y a-t-il des inconvénients à la vaccination?',
    keywords: ['inconvenients', 'risques', 'problemes', 'negatifs', 'dangers'],
    response: '⚖️ **INCONVÉNIENTS & RISQUES (Réalistes):**\n\n**INCONVÉNIENTS MINEURS:**\n⚠️ Coût initial (bien que ROI énorme)\n⚠️ Besoin déplacement centre santé\n⚠️ Effets légers 24-48h (fièvre, fatigue)\n⚠️ Plusieurs doses nécessaires (pas 1 injection suffisante)\n\n**EFFETS SECONDAIRES LÉGERS (Courants):**\n• Rougeur/douleur au site (20-30%)\n• Fièvre légère 38-38.5°C (30-40%)\n• Fatigue temporaire (1-2 jours)\n• Courbatures (5-15%)\n→ **Tous disparaissent en 24-48h**\n\n**EFFETS GRAVES (Extrêmement Rares):**\n• Réaction allergique: 0.0001%\n• Syndrome Guillain-Barré: 1-2 cas/million\n• Myocardite (COVID ARNm): 1 cas/100k\n→ **BEAUCOUP PLUS RARE que risque maladie!**\n\n**COMPARAISON RISQUES:**\n```\nRisque effet grave vaccin:     1/1,000,000\nRisque rougeole sans vaccin:   1/1,000 → MORT/PARALYSIE\nRisque DTC sans vaccin:        100% mortalité tétanos\n```\n\n**VERDICT:** Avantages >> Inconvénients (1000x!) ✅\n\n**Les vrais inconvénients = NE PAS vacciner!** ⚠️',
    category: 'risk',
  },

  // ====== CALENDRIER VACCINAL ======
  {
    id: 'vaccination_calendar_newborn',
    question: 'Quels vaccins pour nouveau-né?',
    keywords: ['nouveau-né', 'bébé', 'naissance', 'nourrisson', '0 mois', 'calendrier nouveau-né'],
    response: '👶 **CALENDRIER VACCINAL COMPLET - NAISSANCE À 12 MOIS:**\n\n**À LA NAISSANCE (24-48h):**\nBCG, Polio (dose 0), Hépatite B\n\n**À 6 SEMAINES:**\nPentavalent (DTC+Hib+HepB), Polio, PCV (Pneumocoque), Rotavirus\n\n**À 10 SEMAINES:**\nPentavalent (dose 2), Polio (dose 2), PCV (dose 2)\n\n**À 14 SEMAINES:**\nPentavalent (dose 3), Polio (dose 3), PCV (dose 3), Rotavirus (dose 3)\n\n**À 9 MOIS:**\nRougeole (VAR), Fièvre Jaune\n\n**IMPORTANCE CHAQUE VACCIN:**\n• BCG: Tuberculose (200k décès/an enfants)\n• Polio: Paralysie (350k cas avant vaccin)\n• DTC: 3 maladies mortelles\n• Pneumocoque: Pneumonie (5M enfants décès)\n• Rougeole: Complications graves\n\n**Objectif:** 9-12 mois = Protection contre 9+ maladies! 🎯\n\n**Respectez le calendrier = Immunité maximale!**',
    category: 'calendar',
  },

  {
    id: 'dtc_vaccine_details',
    question: 'Vaccin DTC - Qu\'est-ce que c\'est?',
    keywords: ['dtc', 'diptherie', 'tetanos', 'coqueluche', 'pentavalent'],
    response: '💉 **VACCIN DTC (PENTAVALENT) - GUIDE COMPLET:**\n\n**PROTÈGE CONTRE 5 MALADIES:**\n\n🔴 **DIPHTÉRIE** (Bactérie)\n• Membrane gris/blanc bloque respiration\n• Avant vaccin (1920s): 1 million cas/an USA\n• Morgalité: 5-10%\n• Aujourd\'hui: <1 cas/an grâce vaccin\n\n🔵 **TÉTANOS** (Bactérie - Clostridium tetani)\n• "Lockjaw" - spasmes violents\n• Asphyxie musculaire\n• Mortalité NON traité: 100%!\n• Transmission: Sol/plaie contaminée\n\n🟡 **COQUELUCHE** (Bactérie - Bordetella)\n• Toux violente 20-50 quintes/jour\n• Apnée bébé <6 mois = GRAVE\n• Avant vaccin (1930s): 200k décès USA/an\n• Maintenant: 10-30 cas/an\n\n🟢 **HAEMOPHILUS INFLUENZAE B (Hib)**\n• Méningite, épiglottite\n• Avant 1990: 600k enfants décès/an\n• Après vaccin: 99% réduction!\n\n🟣 **HÉPATITE B**\n• Virus foie → cirrhose, cancer\n• Chronique 50 millions personnes\n• Protection: À vie si vaccin complet\n\n**CALENDRIER SÉNÉGAL:**\n6 sem → 10 sem → 14 sem → 18 mois → 5-6 ans\n\n**EFFETS SECONDAIRES:**\n✅ Courants: Fièvre 24-48h, rougeur\n✅ Rares: Allergie <0.1%\n✅ Graves: 1/million (très rare!)\n\n**RÉSUMÉ:** DTC = Protection essentielle contre 5 maladies graves! 🛡️',
    category: 'vaccines',
  },

  {
    id: 'polio_vaccine',
    question: 'Vaccin Polio - Informations complètes?',
    keywords: ['polio', 'poliomyelite', 'paralysie', 'paralysie flasque'],
    response: '🦵 **VACCIN POLIO - ÉRADICATION MONDIALE:**\n\n**LA MALADIE:**\n• Virus neurologique → paralysie permanente\n• 5-10% des cas = décès (respiration)\n• 350,000 cas paralysie/an avant vaccin\n• Terreur mondiale 1900-1950s\n• Signes: Fièvre, faiblesse flasque\n\n**CALENDRIER SÉNÉGAL (OMS Standard):**\n• Naissance: Dose 0 (VPI)\n• 6 sem: Dose 1 (VPI)\n• 10 sem: Dose 2 (VPI)\n• 14 sem: Dose 3 (VPI)\n• 18 mois: Rappel\n• 5-6 ans: Rappel\n\n**TYPES DE VACCIN:**\n• VPI (injecté): Virus tué - 100% sûr\n• VPO (oral): Virus vivant atténué - très rare paralysie\n→ OMS recommande VPI (plus sûr)\n\n**EFFICACITÉ:**\n• 95%+ après dose 1\n• 99%+ après 3 doses\n• Protection: À vie\n\n**SUCCÈS OMS:**\n• 1988: 350,000 cas/an\n• 2024: 1,000 cas/an (99.7% réduction!)\n• Prochaine éradication possible (après variole)\n\n**EFFETS SECONDAIRES:**\n✅ VPI: Pratiquement aucun\n✅ VPO: Très rare paralysie (1/million)\n\n**Conclusion:** Polio = presque éradiquée grâce vaccin! 🎉\n\n**Fin polio d\'ici 10 ans possible!**',
    category: 'vaccines',
  },

  {
    id: 'measles_vaccine',
    question: 'Rougeole (ROR) - Tout ce que vous devez savoir?',
    keywords: ['rougeole', 'ror', 'measles', 'oreillons', 'rubella'],
    response: '🔴 **VACCIN ROUGEOLE (ROR) - GUIDE COMPLET:**\n\n**LA MALADIE - ROUGEOLE:**\n• Virus très contagieux (R0=12-20)\n• 1 cas → 15-20 personnes infectées\n• Fièvre 39-40°C, rash total corps\n• Complcations: Pneumonie, otite, encéphalite\n• Mortalité enfants <5 ans: 1-2%\n\n**OMS DONNÉES:**\n• Avant vaccin (1963): 4 millions décès/an\n• Après vaccin (2024): <100,000 décès/an\n• Réduction: 97% mortalité! 🎯\n\n**ROR = 3 VACCINS EN 1:**\n✅ R: Rougeole\n✅ O: Oreillons (parotidite)\n✅ R: Rubella\n\n**CALENDRIER SÉNÉGAL:**\n• 9 mois: Dose 1\n• 18-24 mois: Dose 2 (rappel)\n• Cible: 95% couverture avant 6 ans\n\n**EFFICACITÉ:**\n• 97% après 1 dose\n• 99.7% après 2 doses\n• Protection: À vie\n\n**EFFETS SECONDAIRES:**\n✅ Courants (5-12%):\n   - Fièvre légère (5-12 jours après)\n   - Rash érythémateux\n✅ Rares (0.001%):\n   - Réaction allergique\n✅ JAMAIS:\n   - Autisme ❌ (étude réfutée)\n   - Encéphalite ❌\n\n**IMPORTANCE GLOBALE:**\n• Rougeole = une maladie infantile ancienne mais mortelle\n• Avant vaccin = 750k décès/an (3 maladies)\n• Après vaccin = quasi éliminée en pays développés\n\n**Conclusion:** ROR = Protection triple, sûr & efficace! 🛡️',
    category: 'vaccines',
  },

  {
    id: 'yellow_fever_vaccine',
    question: 'Fièvre jaune - Vaccin obligatoire?',
    keywords: ['fievre jaune', 'amaril', 'yellow fever', 'senegal'],
    response: '🟡 **VACCIN FIÈVRE JAUNE - OBLIGATOIRE SÉNÉGAL:**\n\n**LA MALADIE:**\n• Virus transmis moustiques (Aedes)\n• Fièvre hémorragique (15-50% mortalité)\n• "Vomito Negro" = vomissements sang\n• Symptômes: Fièvre 40°C, ictère (jaunisse)\n• Endémique: Afrique, Amérique latine, Asie\n\n**SÉNÉGAL - CONTEXTE:**\n• Zone endémique fièvre jaune\n• OMS-obligatoire pour tous enfants\n• Taux couverture: 91% (très bon!)\n• Statut: Zéro cas depuis 20 ans grâce vaccin\n\n**CALENDRIER VACCINAL:**\n• 9 mois: Dose 1\n• Rappel: 10 ans (selon OMS)\n\n**EFFICACITÉ:**\n• 95%+ protection après 1 injection\n• Protection: À vie (1 dose suffit!)\n• Passport accepté internationalement\n\n**EFFETS SECONDAIRES:**\n✅ Rares et légers:\n   - Rougeur au site <1%\n   - Fièvre légère 24-48h\n✅ Graves (très rares): 1/million\n\n**VOYAGES:**\n• Certificat reconnu mondialement\n• Valide 10 ans\n• Requis pour voyages certains pays\n\n**Conclusion:** Fièvre jaune = vaccin prioritaire Sénégal! 🎯',
    category: 'vaccines',
  },

  // ====== VACCINATION ENFANTS ======
  {
    id: 'children_vaccination',
    question: 'Pourquoi vacciner les enfants?',
    keywords: ['enfants', 'children', 'protection', 'why vaccinate kids'],
    response: '👧👦 **IMPORTANCE VACCINATION ENFANTS:**\n\n**SYSTÈME IMMUNITAIRE IMMATURE:**\n• 0-6 mois: Immunité maternelle seulement\n• 6-12 mois: Immunité diminue rapidement\n• 1-5 ans: PIC VULNÉRABILITÉ aux infections!\n• Vaccins comblent ce gap critique\n\n**MALADIES MORTELLES ENFANTS:**\n🔴 Rougeole: 1 décès/1000 cas\n🔴 Coqueluche: 1 décès/200 cas (<6 mois)\n🔴 Polio: 5-10% paralysie\n🔴 Méningite: 20-40% décès même traité\n🔴 Haemophilus: 5% décès <5 ans\n\n**DONNÉES OMS (2023):**\n💡 Vaccination enfants = 19 millions vies/an\n💡 ROI: 1€ vaccin = 44€ économies\n💡 Zone non-vaccinée: Mortalité 60x plus élevée!\n\n**AVANT vs APRÈS VACCIN:**\n📊 Rougeole:\n   Avant 1963: 4 millions décès/an\n   Après vaccin: <100k décès/an\n   = 97% réduction!\n\n📊 Polio:\n   Avant 1988: 350k paralysies/an\n   Après vaccin: ~1000 cas/an\n   = 99.7% réduction!\n\n📊 DTC:\n   Sauve 50+ millions enfants/génération\n   Diphtérie: 1M → <1 cas/an\n   Tétanos: 100% → quasi 0\n   Coqueluche: 200k → 10-30 cas/an\n\n**RÉSUMÉ:** Vacciner enfants = **Protection du futur!** 🛡️👪',
    category: 'children',
  },

  // ====== VACCINATION GROSSESSE ======
  {
    id: 'pregnancy_vaccination',
    question: 'Vaccins pendant la grossesse - Est-ce sûr?',
    keywords: ['grossesse', 'enceinte', 'pregnant', 'femme enceinte', 'prenatal'],
    response: '🤰 **VACCINATION FEMME ENCEINTE - GUIDE COMPLET:**\n\n**VACCINS RECOMMANDÉS:**\n✅ **Tétanos (DTC)** - OBLIGATOIRE\n   • 1ère trimestre: Au moins 1 dose\n   • Protège mère & bébé après naissance\n   • Critiques: Tétanos = 100% mortalité!!\n\n✅ **Grippe (inactif)** - RECOMMANDÉ\n   • 1 dose/an (2e-3e trimestre)\n   • Réduit risque grippe grave enceinte\n   • Anticorps transmis bébé\n\n✅ **Coqueluche (Tdcap)** - NOUVEAU\n   • 3e trimestre (28-36 semaines)\n   • Anticorps maternels protègent bébé <2 mois\n   • Prévient coqueluche nouveau-né (mortel)\n\n**VACCINS À ÉVITER:**\n❌ ROR (vivant) - Pas pendant grossesse\n❌ Varicelle (vivant) - Attendre après accouchement\n❌ Fièvre jaune (vivant) - Sauf voyage urgent\n❌ BCG (vivant) - Pas pendant grossesse\n❌ Tous vaccins vivants atténués\n\n**MEILLEURE STRATÉGIE:**\n🎯 **3 MOIS AVANT CONCEPTION:**\n   • Consulter gynécologue\n   • À jour sur TOUS les vaccins\n   • ROR, Varicelle si pas immunité\n   • Vaccins vivants avant grossesse\n\n🎯 **PENDANT GROSSESSE:**\n   • Tétanos: 1ère visite (1er trimestre)\n   • Grippe: 2e-3e trimestre\n   • Coqueluche: 3e trimestre (28-36 sem)\n\n**BÉNÉFICES VACCINATION ENCEINTE:**\n✅ Protège mère (grippe grave = risque)\n✅ Anticorps transmis bébé (protection dès naissance)\n✅ Bébé protégé même avant ses vaccins\n✅ Réduit risque complications\n\n**DONNÉES SÉCURITÉ:**\n📊 40,000+ femmes enceintes vaccinées COVID\n📊 Taux fausse couche: 18-20% (normal!)\n📊 Malformations: Même taux non-vaccinées\n📊 Affection nouveau-né: 0 lien prouvé\n✅ AUCUN effet tératogène prouvé!\n\n**RÉSUMÉ:** Vaccination enceinte = **Protection double!** 🛡️👶',
    category: 'pregnancy',
  },

  // ====== EFFETS SECONDAIRES ======
  {
    id: 'side_effects_complete',
    question: 'Quels sont les effets secondaires des vaccins?',
    keywords: ['effets', 'secondaires', 'reaction', 'adverse', 'danger', 'risque'],
    response: '⚠️ **EFFETS SECONDAIRES - PROFIL SÉCURITÉ COMPLET:**\n\n**EFFETS COURANTS (LÉGERS) - 40-70% VACCINS:**\n✅ Rougeur/douleur injection (20-30%)\n   • Dure: 2-3 jours\n   • Traitement: Froid compresse\n\n✅ Fièvre 38-38.5°C (30-40%)\n   • Dure: 24-48h\n   • Traitement: Paracétamol 15mg/kg\n   • NORMAL = preuve immunité marche!\n\n✅ Fatigue temporaire (20-30%)\n   • Dure: 1-2 jours\n   • Traitement: Repos\n\n✅ Courbatures légères (10-20%)\n   • Dure: 24-48h\n   • Traitement: Repos, hydratation\n\n**EFFETS GRAVES (RARES) - 0.001-0.1%:**\n⚠️ Réaction allergique: 1/100,000\n   • Symptômes: Gonflement, difficulté respirer\n   • Traitement: Épinéphrine (urgence)\n   • Prévention: Observation 15-30 min après\n\n⚠️ Convulsions fébriles: 1/1000\n   • Cause: Fièvre liée vaccin\n   • Généralement sans séquelles\n   • Traitement: Anticonvulsivant\n\n⚠️ Syndrome Guillain-Barré: 1-2/million\n   • Paralysie transitoire\n   • Récupération généralement complète\n   • Très rare après vaccination\n\n**EFFETS TRÈS GRAVES (EXTRÊMEMENT RARES) - 1/million+:**\n❌ Myocardite (inflammation cœur): <1/100k\n   • Surtout COVID ARNm (très rare)\n   • Généralement spontanément résolutive\n   • Beaucoup PLUS rare que myocardite COVID réelle!\n\n❌ Encéphalopathie: 1/million\n   • Non-causale établie (confusion possible)\n\n**COMPARAISON RISQUES - LE CONTEXTE:**\n```\nRisque effet vaccin grave:        1/1,000,000\nRisque rougeole sans vaccin:      1/1,000 → MORT/PARALYSIE\nRisque DTC sans vaccin:           100% mortalité (tétanos)\nRisque polio sans vaccin:         5-15% paralysie permanente\nRisque pneumonie sans PCV:        5M décès enfants <5 ans/an\n```\n\n**VERDICT SCIENTIFIQUE:**\n🎯 Bénéfices vaccin >> Risques (100-1000x!)\n🎯 99.99% doses = 0 problème\n🎯 Bénéfices protection >> Effets courants légers\n\n**GESTION EFFETS SECONDAIRES:**\n\n**Si Fièvre:**\n→ Paracétamol 15mg/kg/dose\n→ Vêtements légers\n→ Hydratation régulière\n→ NORMAL - Disparaît 48h\n\n**Si Rougeur/Gonflement:**\n→ Froid compresse\n→ NORMAL - Pas signe infection grave\n→ Disparaît 3-5 jours\n\n**SI URGENCE (Appelez médecin):**\n→ Difficulté respiration\n→ Gonflement face/gorge\n→ Convulsions (sauf fièvre simple)\n→ Rash généralisé\n→ Température >40°C persistante\n\n**RÉSUMÉ:** Effets légers COURANTS = preuve immunité! Graves = extrêmement rares! ✅',
    category: 'effects',
  },

  // ====== RÔLE AGENTS DE SANTÉ ======
  {
    id: 'healthcare_workers_role',
    question: 'Quel est le rôle des agents de santé en vaccination?',
    keywords: ['agent santé', 'infirmier', 'medecin', 'role', 'professionnel'],
    response: '🏥 **RÔLE ESSENTIEL DES AGENTS DE SANTÉ:**\n\n**1. ÉDUCATION & SENSIBILISATION:**\n✓ Expliquer importance vaccination\n✓ Dissiper mythes & peurs\n✓ Adapter message à culture locale\n✓ Répondre questions parents/patients\n✓ Distribuer brochures éducatives\n✓ Engagement communautaire\n\n**2. ÉVALUATION PRÉ-VACCINATION:**\n✓ Historique médical complet\n✓ Vérifier contre-indications\n✓ Évaluer état santé actuel\n✓ Identifier allergies antérieures\n✓ Risques spécifiques patient\n✓ Consentement éclairé\n\n**3. ADMINISTRATION TECHNIQUE:**\n✓ Chaîne froid respectée (-2 à +8°C)\n✓ Vérifier date expiration vaccin\n✓ Technique injection stérile\n✓ Bonne dose, bon site (IM/SC/ID)\n✓ Asepsie/hygiène stricte\n✓ Sécurité piqûre (pas réutilisation)\n✓ Documentation précise\n\n**4. SURVEILLANCE POST-VACCINATION:**\n✓ Observation 15-30 min (allergie)\n✓ Reconnaître réactions graves\n✓ Traitement urgence si besoin\n✓ Conseils après-vaccin (repos, hydratation)\n✓ Numéro urgence fourni\n✓ Suivi 48h après (téléphone)\n\n**5. GESTION EFFETS SECONDAIRES:**\n✓ Reconnaître effets courants (normaux)\n✓ Rassurer patients (fièvre = immunité!)\n✓ Traiter symptômes légers\n✓ Référer cas graves urgence\n✓ Documenter pharmacovigilance\n✓ Reporter aux autorités\n\n**6. DOCUMENTATION & DATA:**\n✓ Carnet vaccination patient (important!)\n✓ Registre centre santé\n✓ Système information nationale\n✓ Suivi taux couverture\n✓ Alerte épidémies\n✓ Confidentialité données\n\n**7. GESTION CHAÎNE FROID:**\n✓ Stockage température (-2 à +8°C)\n✓ Réfrigérateurs fonctionnels\n✓ Monitoring température 24/7\n✓ Pas rupture chaîne froid\n✓ Vérifier vaccins avant utilisation\n✓ Transport sécurisé (glacières thermiques)\n✓ Audit réguliers\n✓ Formation continues staff\n\n**8. COMMUNICATION & EMPATHIE:**\n✓ Calmer peurs & anxiété\n✓ Écouter attentivement\n✓ Langage simple & clair\n✓ Culturellement sensible\n✓ Montrer empathie\n✓ Traiter parents comme partenaires\n✓ Respecter autonomie décision\n\n**DONNÉES IMPACT AGENTS:**\n📊 Agents BIEN formés = +40% couverture vaccination\n📊 OMS: "Agents = clé succès vaccination"\n📊 Communication effective = -80% hésitation!\n📊 Trust agent = +95% compliance!\n\n**COMPÉTENCES ESSENTIELLES:**\n🎯 Communication: 40%\n🎯 Technique: 30%\n🎯 Culturel/Empathie: 20%\n🎯 Pharmacovigilance: 10%\n\n**FORMATION OMS RECOMMANDÉE:**\n✅ Module 1: Immunologie (20h)\n✅ Module 2: Vaccins (30h)\n✅ Module 3: Technique (20h)\n✅ Module 4: Safety (15h)\n✅ Module 5: Communication (25h)\n✅ Module 6: Data (10h)\n✅ Minimum: 120 heures formation\n✅ Certification annuelle\n\n**APPEL AUX AGENTS:**\n💪 Vous êtes **HÉROS de prévention**\n💪 Vous sauvez **millions de vies**\n💪 Vous construisez **avenir sain**\n💪 **MERCI pour votre engagement!** 🙏\n\n**Conclusion:** Agents santé = **Pilier fondamental vaccination!** 🏥👏',
    category: 'healthcare',
  },

  {
    id: 'healthcare_training',
    question: 'Quelle formation pour les agents de santé?',
    keywords: ['formation', 'training', 'competences', 'apprentissage', 'qualification'],
    response: '📚 **FORMATION AGENTS DE SANTÉ - STANDARDS OMS:**\n\n**MODULES OBLIGATOIRES (120+ heures):**\n\n**Module 1: Fondamentaux Immunologie (20h)**\n• Système immunitaire\n• Types antigènes/anticorps\n• Mémoire immunité\n• Immunité collective concept\n• Réponse immune types\n\n**Module 2: Vaccins (30h)**\n• Types vaccins (vivant/inactivé/ARNm)\n• Efficacité & durée protection\n• Calendrier vaccinal complet\n• Chaîne froid management\n• Stockage & manipulation\n• Vaccins spécifiques détails\n\n**Module 3: Technique Injection (20h)**\n• Asepsie chirurgicale\n• Sites injection (IM/SC/ID)\n• Taille aiguille/seringue correcte\n• Pratique simulation maquettes\n• Sécurité piqûre\n• Gestion aiguilles contaminées\n\n**Module 4: Pharmacovigilance (15h)**\n• Identifier effets secondaires\n• Gradation sévérité\n• Documenter & reporter\n• Triage urgence\n• Gestion anafilaxie\n• Protocoles urgence\n\n**Module 5: Communication (25h)**\n• Compétences communication basique\n• Gérer peurs & hésitation\n• Adapter langage complexe → simple\n• Culturellement sensible\n• Empathie & écoute active\n• Gestion conflits\n• Engagement communautaire\n\n**Module 6: Gestion Données (10h)**\n• Registre vaccination\n• Surveillance couverture\n• Alerte épidémie système\n• Confidentialité données\n• Rapports mensuels\n\n**CERTIFICATION:**\n✅ Minimum: 120 heures formation\n✅ Examen théorique ≥80% minimum\n✅ Test pratique: Admin vaccin simulation\n✅ Stage supervisé: 30 jours\n✅ Certification valide 5 ans\n✅ Renouvellement: Tous 5 ans\n\n**FORMATION CONTINUE:**\n✅ 8 heures/an minimum\n✅ Mise à jour vaccins nouveaux\n✅ Protocol changements\n✅ Réunion équipe mensuelles\n✅ Supervision externe annuelle\n✅ Cours refresher tous 2 ans\n\n**EN SÉNÉGAL - RESSOURCES:**\n🇸🇳 MSAS: Formation nationale\n🇸🇳 Université Cheikh Anta Diop\n🇸🇳 Écoles infirmiers agrément\n🇸🇳 Certification: Valide 5 ans\n🇸🇳 OMS: Support technique\n\n**IMPORTANCE FORMATION:**\n📊 Formation bien faite = +40% couverture\n📊 Agents QUALIFIÉS = confiance communauté\n📊 Knowledge = Meilleur conseil\n📊 Technique correcte = Zéro contamination\n\n**Conclusion:** Formation = **Investissement santé publique!** 📖✅',
    category: 'healthcare',
  },

  // ====== MYTHES VS SCIENCE ======
  {
    id: 'vaccine_myths_autism',
    question: 'Les vaccins causent-ils l\'autisme?',
    keywords: ['mythe', 'autisme', 'linker', 'faux', 'fraudulent'],
    response: '❌ **MYTHE: "VACCINS CAUSENT AUTISME"**\n\n**RÉALITÉ SCIENTIFIQUE: COMPLÈTEMENT FAUX ❌**\n\n**THE FRAUDULENT STUDY:**\n\n1998 - Wakefield et al. publié étude:\n• Prétendait lien vaccine-autisme\n• Seulement 12 patients (très petite)\n• Résultats: Non-reproductibles\n• 1999: **RETRACTÉE** (frauduleuse!)\n• Wakefield: **Perdu license médical**\n• Raison: Données falsifiées, conflit intérêt\n\n**PREUVES SCIENTIFIQUES MASSIVE (100+ études):**\n\n🔬 **Étude Hviid (2019) - Danemark:**\n• 600,000+ enfants suivi\n• Comparaison: Vaccinés vs non-vaccinés\n• Résultat: **Zéro différence** taux autisme\n• Conclusion: Pas de lien\n\n🔬 **Étude Jørgensen (2007) - UK:**\n• 500,000+ enfants\n• Même taux autisme: Vaccin = Non-vaccin\n• Autisme IDENTIFIÉ même sans vaccin\n\n🔬 **CDC 2014 - USA:**\n• 95,000+ enfants\n• Même prévalence autisme partout\n• Vaccins = 0 effet autisme\n\n🔬 **Meta-analysis (70+ études):**\n• Tous pays: Zéro association\n• Zéro lien prouvé nulle part\n• Robustesse: Excellent\n\n**TIMELINE - LA PREUVE DÉFINITIVE:**\n\nVaccins débutent: **6 semaines**\nAutisme diagnostiqué: **18-36 MOIS**\n\n→ Si vaccin cause autisme:\n   Autisme devrait débuter 6-8 weeks\n   But: Diagnostiqué ANNÉES PLUS TARD!\n\n→ **Timing impossible = Vaccin ne cause pas!**\n\n**AUGMENTATION AUTISME EXPLIQUÉE:**\n\n❌ **PAS:** Plus cas (vaccin cause)\n✅ **OUI:** Meilleur diagnostic!\n\n• 1990: DSM-3 = Définition très restrictive autisme\n• 2000: DSM-4 = Spektrum élargi (3x plus inclusion)\n• 2010: Meilleur screening scolaires\n• 2020: Early intervention programs\n• = Plus diagnostic = Pas plus vrais cas!\n\n**C\'est épidémiologie classique: Increased awareness ≠ Increased incidence**\n\n**POSITION SCIENTIFIQUE MONDIALE:**\n✅ CDC (USA)\n✅ OMS\n✅ AAP (Pediatricians)\n✅ European Commission\n✅ Cochrane Reviews\n✅ Nature Journal\n✅ The Lancet\n\n**TOUS CONSTATENT:** \"Aucune preuve lien vaccine-autisme\"\n\n**VERDICT:**\n🎯 **100% DÉBUNKED** ✅\n🎯 **Vaccins n\'ont RIEN have à voir autisme**\n🎯 **"Vaccine autism link" = SCIENCE FICTION**\n\n**Consommez information: Sources scientifiques!** 📚',
    category: 'myths',
  },

  {
    id: 'vaccine_myths_dna',
    question: 'Les vaccins modifient-ils l\'ADN?',
    keywords: ['adn', 'dna', 'genetique', 'modifier', 'mutation'],
    response: '❌ **MYTHE: "VACCINS MODIFIENT ADN"**\n\n**RÉALITÉ: BIOLOGIQUEMENT IMPOSSIBLE ❌**\n\n**COMPRENDRE LA BIOLOGIE:**\n\n**ARNm (Pfizer/Moderna COVID):**\n\n🧬 Qu\'est ARNm?\n• Copy temporaire message ADN\n• Synthétique (créé laboratoire)\n• **Dure: 15-30 MINUTES SEULEMENT**\n• Dégradé rapidement enzymes cellulaires\n• **JAMAIS entre noyau cellulaire** ❌\n• Contrairement ADN = persistent\n\n🧬 Peut modification ADN?\n\nNÉCESSAIRE pour modifier ADN:\n1. Accès noyau cellulaire (ARNm = non, membrane imperméable)\n2. Reverse transcriptase (enzyme spéciale) ← **CELLULE PAS AVOIR** ❌\n3. Temps assez (ARNm = 30 min, insufficient)\n4. Intégration système réparation ADN\n\nARNm seul = **IMPOSSIBLE modifier ADN**\nSans reverse transcriptase = Zéro modif\n\n🧬 Preuve scientifique?\n• Mécanisme ARN connu 40+ années\n• 10,000+ études publications\n• Aucun cas modification ADN reporté\n• Safety monitoring: Bill & Melinda Gates, EMA, FDA\n• Nobel Prize Chimie 2023 **AWARDED ARNm developers!**\n\n**ANALOGIE SIMPLE:**\n```\nARNm = Recette temporaire photocopiée\nADN = Original blueprint dans coffre-fort\n\nPhotocopie temporaire (→ disparaît)\n≠ Modifier blueprint original!\n\nImpossible accéder coffre-fort = Impossible modifier!\n```\n\n**VERDICT SCIENTIFIQUE:**\n🎯 **BIOLOGIQUEMENT IMPOSSIBLE**\n🎯 **ARNm ≠ Peut modifier ADN**\n🎯 **Cellule sans outils nécessaires**\n🎯 **ARNm = Trop court-lived**\n\n**Nobel Prize 2023 = Confirmation sécurité ARNm!** 🏆',
    category: 'myths',
  },

  // ====== QUESTIONS FRÉQUENTES ======
  {
    id: 'vaccine_safety_overall',
    question: 'Les vaccins sont-ils sûrs?',
    keywords: ['sur', 'safe', 'securite', 'confiance', 'trust'],
    response: '✅ **OUI - VACCINS SONT ULTRA-SÛRS:**\n\n**DONNÉES GLOBALES:**\n📊 5+ milliards de vaccins administrés\n📊 99.999%+ sans complications graves\n📊 Surveillés par agences mondiales\n📊 Safety = Priorité absolue\n\n**PROCESSUS DE SÉCURITÉ RIGOUREUX:**\n\n1️⃣ **Recherche (10-15 ans)**\n   • Tests laboratoire\n   • Modèles animaux\n   • Études toxicité\n\n2️⃣ **Essais Cliniques (3 phases)**\n   • Phase I: 20-100 sujets (sécurité basique)\n   • Phase II: 100-1000 sujets (efficacité, dose)\n   • Phase III: 1000-10000+ sujets (efficacité finale)\n   • Tous volontaires informés\n\n3️⃣ **Approbation Régulière**\n   • FDA (USA)\n   • EMA (Europe)\n   • Agences nationales\n   • Peer-review scientifique\n\n4️⃣ **Surveillance Post-Commercialisation**\n   • Phase IV: Millions patients\n   • Systems pharmacovigilance\n   • Base données mondiale\n   • Rapports publics\n\n5️⃣ **Rapports Publics Transparents**\n   • Publications peer-reviewed\n   • Données disponibles OMS\n   • Accès chercheurs indépendants\n   • Méthodologie auditable\n\n**COMPARAISON RISQUES:**\n```\nEffets graves vaccin:           1/1,000,000\nRisque maladie sans vaccin:     1/1,000 → MORT/PARALYSIE\nRatio sécurité:                 1000x+ PLUS SÛR vaccin!\n```\n\n**RÉFUTATION MYTHES:**\n\n❌ MYTHE: "Autisme"\n✅ VÉRITÉ: 100+ études = Zéro lien\n\n❌ MYTHE: "Modifie ADN"\n✅ VÉRITÉ: Biologiquement impossible\n\n❌ MYTHE: "Infertilité"\n✅ VÉRITÉ: 40,000 femmes enceintes vaccinées = Fertilité normale\n\n❌ MYTHE: "5G chips"\n✅ VÉRITÉ: Impossible techniquement\n\n**CONSENSUS SCIENTIFIQUE MONDIAL:**\n✅ WHO (OMS)\n✅ CDC\n✅ FDA\n✅ EMA\n✅ Académie pédiatrie (AAP)\n✅ Nature, Lancet, JAMA\n\n**TOUS CONSTATENT:** Vaccins très sûrs! ✅\n\n**Conclusion:** **VACCINS = Produits médicaux plus sûrs du monde!** 🛡️✅',
    category: 'safety',
  },

  {
    id: 'vaccine_hesitancy_address',
    question: 'Comment combattre l\'hésitation vaccinale?',
    keywords: ['hesitation', 'confiance', 'peur', 'reticence', 'refus', 'doute', 'mythe'],
    response: '🤝 **COMBATTRE HÉSITATION VACCINALE - STRATÉGIES ÉPROUVÉES:**\n\n**CAUSES HÉSITATION (Par fréquence):**\n\n1️⃣ **PEUR (40% hésitants)**\n   • Peur effets secondaires\n   • "Mon bébé sera malade"\n   • Peur douleur piqûre\n   • Solutions:\n      → Education pré-vaccination\n      → Montrer transparence\n      → Expliquer risques réels vs benefits\n      → Témoignages autres parents\n\n2️⃣ **MYTHES (30%)**\n   • Vaccins causent autisme (RÉFUTÉ)\n   • Contiennent microchips (IMPOSSIBLE)\n   • "C\'est complot Occident" (FAUX)\n   • Solutions:\n      → Corriger info avec tact\n      → Élite locale support (chef, imam)\n      → Brochures éducatives claires\n      → Discussion honnête\n\n3️⃣ **RELIGIEUX/CULTUREL (20%)**\n   • "Against religion" (faux)\n   • Traditionalistes préfient remedies anciennes\n   • Solutions:\n      → Engage imams/leaders religieux\n      → Religious perspective vaccination\n      → Respect croyances culturelles\n      → Adaptation message local\n\n4️⃣ **ACCÈS (10%)**\n   • Trop loin centre santé\n   • Coût (même gratuit perçu)\n   • Horaires inconvenients\n   • Solutions:\n      → Mobile teams villages\n      → Community sites vaccination\n      → Flexible hours\n      → Zero-cost assurance\n\n**STRATÉGIES AGENT DE SANTÉ:**\n\n✅ **1. LISTEN - Écouter:**\n• Ne pas juger\n• Comprendre vraies concerns\n• Montrer empathie réelle\n• "Je comprends votre peur, mais..."\n\n✅ **2. EDUCATE - Informer:**\n• Facts simples, PAS jargon médical\n• Brochures visuelles\n• Expliquer maladie vs vaccin\n• Compare risques: Vaccin << Maladie\n• Langage simple & clair\n\n✅ **3. SHOW EVIDENCE:**\n• Données locales: "Zéro décès vaccine Sénégal"\n• Success stories\n• Autres parents satisfied\n• Professional endorsement (médecin, religieux)\n• Voici carnet vaccination enfant ok à 2 ans\n\n✅ **4. ADDRESS CONCERNS:**\n• Peur needles? "Très petit, super rapide" (demo)\n• Peur side effects? "Léger, disparaît 48h" (expliquer fièvre = immunité bien)\n• Peur autisme? "Aucune preuve, +100 études" (montrer données)\n• Autres concerns? **Écoutez réellement!**\n\n✅ **5. BUILD TRUST:**\n• Apparence professionnel\n• Transparence totale (show vaccine)\n• Honnête: "Je sais pas réponse" = CRÉDIBILITÉ!\n• Follow-up: Appel 48h après "Bébé ok?"\n• Respecter autonomie décision\n• Relationship long-terme\n\n**PHRASES EFFICACES:**\n\n🗣️ "Vaccin protège votre enfant maladie grave."\n🗣️ "Fièvre 24h est ok - montre immunité marche!"\n🗣️ "Risque vaccin très petite, risque maladie très grande."\n🗣️ "Tous enfants Sénégal vaccinés ok - pourquoi pas votre?"\n🗣️ "Je vaccine mes propres enfants - faites-moi confiance!"\n🗣️ "Questions? Je réponse honnête - aucun secret."\n🗣️ "Voyons ensemble vos préoccupations."\n\n**QUAND REFUS PERSISTANT:**\n\n⚠️ **NE PAS:**\n❌ Forcer ou juger\n❌ Menacer ou punir\n❌ Abandon complet\n\n✅ **À FAIRE:**\n✓ Respecter autonomie\n✓ Provide resources written\n✓ Invitation future vaccination\n✓ Report système (suivi)\n✓ Considérer autres vaccines (pas tout-ou-rien)\n✓ Keep door open (next visit?)\n\n**CAMPAGNE ANTI-HÉSITATION OMS-MSAS:**\n\n🎯 #VaccineSénégal2024\n• Local messengers (imams, teachers, mères)\n• Whatsapp groups success stories\n• Celebrity endorsement (sports, politics)\n• Telemarketing reminders\n• Community events (festivals vaccination)\n• Radio spots\n• SMS campaigns\n\n**DONNÉES EFFICACITÉ INTERVENTIONS:**\n📊 Education 1-1: 70% conversion hésitant → vaccinate\n📊 Community leaders engagement: 85% success\n📊 Peer influence: 60% effective\n📊 Honest dialogue: 65% acceptance\n📊 Mobile teams: +50% coverage remote areas\n📊 Religious support: +40% acceptance\n\n**RÉSUMÉ DU SUCCÈS:**\n\n✨ **Listen** + **Educate** + **Evidence** + **Empathy** = **Trust** ✨\n\n**Trust = Vaccination consent** 💚\n\n**Appel à Agents Sénégal:**\n"Vaccination = acte d\'amour pour enfants\nConfiance + Education = Succès collectif"\n\n**Ensemble, construisons Sénégal sans épidémie!** 🇸🇳💪',
    category: 'healthcare',
  },

  // ====== CALENDRIER COMPLET ======
  {
    id: 'complete_vaccination_schedule',
    question: 'Quel est le calendrier vaccinal complet?',
    keywords: ['calendrier', 'schedule', 'planning', 'chronologie', 'dates', 'quand'],
    response: '📅 **CALENDRIER VACCINAL COMPLET SÉNÉGAL (OMS):**\n\n**ENFANTS (0-12 ans):**\n\n✅ **À LA NAISSANCE (24-48h):**\n   BCG, Polio (dose 0), Hépatite B\n\n✅ **6 SEMAINES:**\n   Pentavalent (1), Polio (1), PCV (1), Rotavirus (1)\n\n✅ **10 SEMAINES:**\n   Pentavalent (2), Polio (2), PCV (2)\n\n✅ **14 SEMAINES:**\n   Pentavalent (3), Polio (3), PCV (3), Rotavirus (3)\n\n✅ **9 MOIS:**\n   Rougeole (1), Fièvre Jaune\n\n✅ **18 MOIS:**\n   Pentavalent rappel, Polio rappel\n\n✅ **24 MOIS:**\n   Rougeole rappel (2)\n\n✅ **5-6 ANS:**\n   DTC rappel, Polio rappel\n\n✅ **12-13 ANS:**\n   Vaccins adolescents (HPV filles)\n\n**FEMMES ADULTES:**\n\n✅ **PRÉ-CONCEPTION:**\n   • À jour tous vaccins\n   • ROR si pas immunité\n   • Varicelle si pas\n\n✅ **PENDANT GROSSESSE:**\n   • Tétanos (1er trimestre)\n   • Grippe (2e-3e trimestre)\n   • Coqueluche (3e trimestre)\n\n**ADULTES:**\n\n✅ **GRIPPE:**\n   Annuelle (chaque automne)\n\n✅ **DTC:**\n   Rappel tous 10 ans\n\n✅ **PNEUMOCOQUE:**\n   > 65 ans: PCV20 ou PCV15+PPSV23\n\n✅ **HERPES ZOSTER:**\n   > 60 ans: 2 doses\n\n**GROUPE À RISQUE:**\n\n✅ **IMMUNODÉPRIMÉS:**\n   → Consult médecin pour planning\n   → Vaccins inactivés OK\n   → Vaccins vivants = risqué\n\n✅ **PROFESSIONNELS SANTÉ:**\n   → Tous vaccins + Hépatite B\n\n✅ **VOYAGEURS:**\n   → Fièvre jaune, Typhoïde, Hépatite\n   → Selon destination\n\n**TAUX COUVERTURE CIBLES OMS SÉNÉGAL:**\n✓ DTC3: 95% (actual: 92%)\n✓ Polio3: 95% (actual: 91%)\n✓ Rougeole: 95% (actual: 88%)\n✓ Fièvre Jaune: 90% (actual: 91%) ✅\n✓ HPV: 60% (actual: 45%)\n\n**Consultez centre santé local pour planning personnalisé!** 🏥',
    category: 'calendar',
  },

  // ====== QUESTIONS SENEGAL SPÉCIFIQUES ======
  {
    id: 'vaccination_senegal_strategy',
    question: 'Quelle est la stratégie vaccination Sénégal?',
    keywords: ['senegal', 'strategie', 'nationale', 'msas', 'obiectifs'],
    response: '🇸🇳 **STRATÉGIE VACCINATION SÉNÉGAL - OMS/MSAS 2024:**\n\n**OBJECTIFS PRIORITAIRES:**\n\n🎯 **DTC Coverage: 95%+ (actual: 92%)**\n   • Gap: 3% (focus rural areas)\n   • Strategy: Mobile teams\n   • Timeline: 2025 target\n\n🎯 **Éliminer Rougeole:**\n   • Target: Zéro cas\n   • Coverage: 95% deux doses\n   • Strategy: Campagne 2024-2025\n\n🎯 **Polio-Free Status Maintenance:**\n   • Zéro cas depuis 10+ ans ✅\n   • Campaign: NID 4x/an\n   • Coverage: >95% <5 ans\n\n🎯 **Fièvre Jaune: 90%+ coverage**\n   • Actual: 91% ✅ (exceeding!)\n   • Status: Zéro cas 20 years\n   • Maintenance: Annual catch-up\n\n🎯 **HPV Coverage: 80% (actual 45%)**\n   • Cancer cervical elimination\n   • Girls 12-13 years\n   • Timeline: 2026 target\n\n**RESSOURCES DISPONIBLES:**\n\n✅ **Fixed Centers:**\n   • 1000+ centres santé permanents\n   • Horaires réguliers\n   • Chaîne froid sécurisée\n\n✅ **Mobile Teams:**\n   • 50+ équipes mobiles\n   • Villages difficile accès\n   • Cibles: Zones rurales\n\n✅ **School Programs:**\n   • Vaccination écoles primaires\n   • HPV campagne scolaire\n   • Coverage: 80% enfants école\n\n✅ **Community Events:**\n   • Semaines vaccination\n   • Villages festivals\n   • Mobilisation locale\n\n**DÉFIS IDENTIFIÉS:**\n\n❌ **Chaîne Froid (20% vaccine waste):**\n   • Solaire fridges: Solution en cours\n   • Monitoring 24/7: À améliorer\n\n❌ **Accès Zones Rurales:**\n   • +50 teams mobiles nécessaire\n   • Routes mauvaises: Problème\n   • Solution: Motos vaccination\n\n❌ **Hésitation Vaccinale (15-20%):**\n   • Rumeurs anti-vaccins\n   • Mythes persistants\n   • Solution: Education culturelle\n\n❌ **Data System (weak surveillance):**\n   • Manual registries → errors\n   • Digital system: En développement\n   • Timeline: 2025 rollout\n\n**INTERVENTIONS 2024-2025:**\n\n✅ **Communication:**\n   • TV/Radio campaigns\n   • Whatsapp community groups\n   • Celebrity endorsements\n   • Imams engagement\n\n✅ **Capacity Building:**\n   • 1000+ agents health formation\n   • Refresher training tous 6 mois\n   • Certification system\n\n✅ **Infrastructure:**\n   • Réfrigérateurs solaires\n   • Digital data system\n   • Cold chain monitoring\n   • Vehicles vacuum\n\n✅ **Partnerships:**\n   • Collaboration GAVI\n   • WHO technical support\n   • UNICEF logistique\n   • Fondations privées\n\n**BUDGET VACCINATION SÉNÉGAL (2024):**\n💰 $50 million USD/an\n   • Vaccins: 70%\n   • Logistique/Chain froid: 15%\n   • Personnel: 10%\n   • Advocacy/Communication: 5%\n\n**RÉSULTATS ACHIEVEMENTS:**\n\n✅ Polio-free: 10+ years (WHO certified)\n✅ Fièvre Jaune: 91% coverage (exceeding)\n✅ DTC: 92% (approaching 95%)\n✅ Rougeole: 88% → target 95%\n✅ Zero épidémies majeures: 15 years\n\n**VISION 2030 SÉNÉGAL:**\n\n🌟 **DTC/Polio: 99% couverture**\n🌟 **Rougeole: ÉRADIQUÉE**\n🌟 **Aucune maladie preventable vaccine**\n🌟 **Population saine & productive**\n🌟 **Modèle Afrique vaccination**\n\n**Appel Population Sénégal:**\n\n"Vaccination = investissement futur.\n95% couverture = zéro maladies = économie forte.\nEnsemble construisons Sénégal sans épidémie!"\n\n**SOURCE:** MSAS/Sénégal + OMS Immunization 2024 💚🇸🇳',
    category: 'general',
  },
];

export function searchQADataset(query: string): QAItem | null {
  if (!query || !query.trim()) {
    return null;
  }

  const queryLower = query.toLowerCase();

  // Recherche exacte d'abord
  for (const item of vaccinationQADataset) {
    if (item.question.toLowerCase() === queryLower) {
      return item;
    }
  }

  // Recherche par mots clés
  for (const item of vaccinationQADataset) {
    if (item.keywords) {
      for (const keyword of item.keywords) {
        if (queryLower.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(queryLower)) {
          return item;
        }
      }
    }
  }

  // Recherche partielle (containment)
  for (const item of vaccinationQADataset) {
    if (item.question.toLowerCase().includes(queryLower)) {
      return item;
    }
    for (const keyword of item.keywords || []) {
      if (queryLower.includes(keyword) || keyword.includes(queryLower.substring(0, 3))) {
        return item;
      }
    }
  }

  // Levenshtein distance pour fuzzy matching
  let bestMatch: QAItem | null = null;
  let bestScore = 0;

  for (const item of vaccinationQADataset) {
    const score = calculateSimilarity(queryLower, item.question.toLowerCase());
    if (score > 0.6 && score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }

    for (const keyword of item.keywords || []) {
      const keywordScore = calculateSimilarity(queryLower, keyword);
      if (keywordScore > 0.7 && keywordScore > bestScore) {
        bestScore = keywordScore;
        bestMatch = item;
      }
    }
  }

  return bestMatch;
}

/**
 * Calcul de similarité (Levenshtein simplifiée)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Distance d\'édition (Levenshtein)
 */
function getEditDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
}

export default vaccinationQADataset;
