import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage }) => {
  const location = useLocation();
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Update language based on route
    // Any path starting with '/en' is treated as English,
    // everything else is treated as Turkish.
    if (location.pathname.startsWith('/en')) {
      setLanguageState('en');
      localStorage.setItem('nexus-language', 'en');
    } else {
      setLanguageState('tr');
      localStorage.setItem('nexus-language', 'tr');
    }
  }, [location.pathname]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus-language', lang);
  };

  const translations: Record<Language, Record<string, string>> = {
    tr: {
      // Navbar
      'nav.vision': 'VİZYON',
      'nav.technology': 'TEKNOLOJİ',
      'nav.articles': 'MAKALELER',
      'nav.defense': 'SAVUNMA',
      'nav.services': 'HİZMETLER',
      'nav.team': 'EKİP',
      'nav.contact': 'İLETİŞİM',
      'nav.vision.mobile': 'Vizyon',
      'nav.technology.mobile': 'Teknoloji',
      'nav.articles.mobile': 'Makaleler',
      'nav.defense.mobile': 'Savunma',
      'nav.services.mobile': 'Hizmetler',
      'nav.team.mobile': 'Ekip',
      'nav.contact.mobile': 'İletişim',
      
      // Hero
      'hero.title': 'GIDAYI ERİŞİLEBİLİR KILMAK',
      'hero.subtitle': 'Nexus, tarımsal üretimde verimlilik limitlerini zorlayan kontrollü tarım çözümleri sunar.',
      'hero.button': 'Teknolojiyi Keşfet',
      
      // Manifesto
      'manifesto.title': 'TARIMIN GELECEĞİNİ',
      'manifesto.title2': 'KONTROL ALTINA ALIYORUZ.',
      'manifesto.description': 'Biyolojiyi bir teknoloji platformu olarak ele alıyoruz. Dikey çiftliklerden açık araziye, amacımız minimum girdi ile fiziksel limitlerde üretim yapmak.',
      'manifesto.dataDriven': 'VERİ ODAKLI',
      'manifesto.dataDrivenDesc': 'Karar mekanizması insan değil, algoritmadır.',
      'manifesto.scalable': 'ÖLÇEKLENEBİLİR',
      'manifesto.scalableDesc': 'Modüler yapılarla sınırsız büyüme kapasitesi.',
      'manifesto.sustainable': 'SÜRDÜRÜLEBİLİRLİK',
      'manifesto.sustainableDesc': 'Her iklimde, her coğrafyada aynı standart.',
      
      // Technology
      'tech.title': 'TEKNOLOJİ',
      'tech.ai.tab': 'AI',
      'tech.hardware.tab': 'DONANIM',
      'tech.ai.title': 'Tarımı Bir Sistem Olarak Ele Alıyoruz',
      'tech.ai.intro': 'Nexus Biotechnologies, tarımı donanım, sensör altyapısı, veri ve yapay zeka ile birlikte çalışan entegre bir sistem olarak ele alır. Tarla tarımı, seralar ve kontrollü ortamları (dikey tarım dahil) kapsayan bütünsel bir yaklaşım.',
      'tech.ai.layer1.title': 'Fiziksel Sensör ve Altyapı',
      'tech.ai.layer1.desc': 'Tarla, sera ve kontrollü ortamlarda sürekli izleme. Toprak, hava, iklim ve mahsul parametrelerinin gerçek zamanlı ölçümü.',
      'tech.ai.layer2.title': 'Mahsul ve Biyolojik Durum Zekası',
      'tech.ai.layer2.desc': 'Bitkilerin fizyolojik durumunun anlaşılması. Büyüme, sağlık ve verimliliğin derinlemesine analizi.',
      'tech.ai.layer3.title': 'Ortam Çevirisi',
      'tech.ai.layer3.desc': 'Tarla, sera ve kontrollü sistemler arasında bilgi transferi. Her ortamdaki verilerin birbiriyle entegrasyonu.',
      'tech.ai.layer4.title': 'Kaynak Tahsisi ve Optimizasyon',
      'tech.ai.layer4.desc': 'Işık, su, besin ve enerji kaynaklarının dinamik yönetimi. Her ortamın özel ihtiyaçlarına göre optimizasyon.',
      'tech.ai.layer5.title': 'Sürekli Öğrenme ve İyileştirme',
      'tech.ai.layer5.desc': 'Sistem performansının sürekli değerlendirilmesi. Zaman içinde gelişen ve uyum sağlayan operasyonel zeka.',
      'tech.systemArchitecture': 'SİSTEM MİMARİSİ',
      'tech.prototype': 'PROTOTİP',
      'tech.comingSoon': 'Çok Yakında...',
      'tech.oasis.name': 'OASIS',
      'tech.oasis.subtitle': 'DİKEY TARIM ENTEGRASYONU',
      'tech.oasis.description': 'Kapalı devre sistemler. Foton başına maksimum verim. Şehir içi üretim için ultra-yoğun mimari ve dikey yapılanma.',
      'tech.oasis.details': '%40 IŞIK TASARRUFU // 98% SU TASARRUFU',
      'tech.aether.name': 'AETHER',
      'tech.aether.subtitle': 'KONTROLLÜ SERA SİSTEMLERİ',
      'tech.aether.description': 'Topraksız tarım seraları. Hibrit ışıklandırma ve iklimlendirme algoritmaları ile yıl boyu standart, yüksek rekolte.',
      'tech.aether.details': 'TAM İKLİM KONTROLÜ // HİBRİT SPEKTRUM',
      'tech.terra.name': 'TERRA',
      'tech.terra.subtitle': 'AÇIK ARAZİ OTONOMİSİ',
      'tech.terra.description': 'Konvansiyonel tarım için robotik iyileştirme. Uydu destekli rekolte tahmini ve yapay zeka tabanlı kaynak yönetimi.',
      'tech.terra.details': 'DRONE İLE GÖRÜNTÜ İŞLEME, GÜBRELEME VE İLAÇLAMA',
      'tech.ecodome.name': 'ECODOME',
      'tech.ecodome.subtitle': 'SENSÖR İSTASYONU',
      'tech.ecodome.description': 'Çevresel izleme ve veri toplama ünitesi. Toprak, hava ve iklim parametrelerini sürekli ölçer. AI sistemine operasyonel kararlar için gerçek zamanlı veri sağlar.',
      'tech.ecodome.details': 'GERÇEK ZAMANLI İZLEME // VERİ TOPLAMA',
      
      // Engineering
      'engineering.title': 'MAKALELER',
      'engineering.description': 'Tarımın fiziğini, sistemlerini ve geleceğini keşfedin.',
      'engineering.comingSoon': 'Çok Yakında...',
      
      // DefenseSpace
      'defense.title': 'KRİTİK ALTYAPI',
      'defense.subtitle': 'Zorlu koşullar için',
      'defense.subtitle2': 'dayanıklı sistemler.',
      'defense.defense': 'SAVUNMA',
      'defense.defenseDesc': 'Kriz anlarında tedarik zincirinden bağımsız, izole ve güvenli gıda üretim modülleri.',
      'defense.space': 'UZAY',
      'defense.spaceDesc': 'Mars&Ay kolonizasyonu ve uzay görevleri için biyorejeneratif yaşam destek üniteleri (CELSS).',
      
      // Services
      'services.title': 'HİZMETLER',
      'services.service1.title': 'Mühendislik Çözümleri',
      'services.service1.desc': 'Tesis, tarla ve saha optimizasyonu.',
      'services.service2.title': 'Anahtar Teslim Projeler',
      'services.service2.desc': 'Uçtan uca kurulum ve entegrasyon.',
      'services.service3.title': 'Savunma Sanayi Projeleri',
      'services.service3.desc': 'Stratejik gıda ve biyogüvenlik çözümleri.',
      'services.service4.title': 'Danışmanlık ve Proje Yönetimi',
      'services.service4.desc': 'Stratejik danışmanlık ve kapsamlı proje yönetimi hizmetleri.',
      'services.button': 'İletişime Geç',
      'services.phoneLabel': 'Telefon:',
      
      // Service Pages
      'servicePage.back': 'Ana Sayfaya Dön',
      'servicePage.features': 'ÖZELLİKLER',
      'servicePage.process': 'SÜREÇ',
      'servicePage.ctaTitle': 'PROJENİZİ BAŞLATIN',
      'servicePage.ctaDesc': 'Mühendislik uzmanlığımızla tarımsal üretiminizi optimize edin.',
      
      // Service 1 - Engineering Solutions
      'service1.subtitle': 'Tarımsal üretimde verimliliği artıran mühendislik çözümleri.',
      'service1.description': 'Nexus, tesis tasarımından saha optimizasyonuna kadar geniş bir yelpazede mühendislik hizmetleri sunar. Kontrollü çevre tarımı sistemlerinin fiziksel limitlerini zorlayarak maksimum verim elde etmenizi sağlarız.',
      'service1.feature1.title': 'Tesis Tasarımı',
      'service1.feature1.desc': 'Dikey çiftlikler ve kontrollü sera sistemleri için özel mimari ve mühendislik çözümleri.',
      'service1.feature2.title': 'Saha Optimizasyonu',
      'service1.feature2.desc': 'Mevcut tesislerinizin performans analizi ve verimlilik artırıcı optimizasyon önerileri.',
      'service1.feature3.title': 'İklim Kontrol Sistemleri',
      'service1.feature3.desc': 'Hibrit ışıklandırma, havalandırma ve iklimlendirme sistemlerinin entegrasyonu.',
      'service1.feature4.title': 'Veri Analizi ve Modelleme',
      'service1.feature4.desc': 'Yapay zeka destekli rekolte tahmini ve kaynak yönetimi algoritmaları.',
      'service1.process1.title': 'İhtiyaç Analizi',
      'service1.process1.desc': 'Mevcut durumunuzun detaylı analizi ve hedef belirleme.',
      'service1.process2.title': 'Tasarım ve Planlama',
      'service1.process2.desc': 'Özel mühendislik çözümlerinin tasarımı ve uygulama planlaması.',
      'service1.process3.title': 'Uygulama ve Entegrasyon',
      'service1.process3.desc': 'Sistemlerin kurulumu ve mevcut altyapıyla entegrasyonu.',
      'service1.process4.title': 'Optimizasyon ve Destek',
      'service1.process4.desc': 'Sürekli performans izleme ve sistem optimizasyonu.',
      
      // Service 2 - Turnkey Projects
      'service2.subtitle': 'Baştan sona tam entegre tarım sistemleri.',
      'service2.description': 'Anahtar teslim projelerimiz, konseptten üretime kadar tüm süreci kapsar. Nexus teknolojilerini kullanarak sıfırdan bir tarım tesisi kurmanızı sağlıyoruz.',
      'service2.feature1.title': 'Tam Entegrasyon',
      'service2.feature1.desc': 'OASIS, AETHER ve TERRA sistemlerinin uyumlu entegrasyonu.',
      'service2.feature2.title': 'Özel Mimari',
      'service2.feature2.desc': 'İhtiyaçlarınıza özel tasarlanmış tesis mimarisi ve altyapı.',
      'service2.feature3.title': 'Otomasyon Sistemleri',
      'service2.feature3.desc': 'Tam otomatik hasat, sulama ve iklim kontrol sistemleri.',
      'service2.feature4.title': 'Eğitim ve Dokümantasyon',
      'service2.feature4.desc': 'Personel eğitimi ve kapsamlı teknik dokümantasyon.',
      'service2.process1.title': 'Konsept Geliştirme',
      'service2.process1.desc': 'Proje kapsamının belirlenmesi ve konsept tasarımı.',
      'service2.process2.title': 'Mühendislik ve Tasarım',
      'service2.process2.desc': 'Detaylı mühendislik çizimleri ve sistem spesifikasyonları.',
      'service2.process3.title': 'İnşaat ve Kurulum',
      'service2.process3.desc': 'Tesis inşaatı ve tüm sistemlerin kurulumu.',
      'service2.process4.title': 'Devreye Alma',
      'service2.process4.desc': 'Sistem testleri, kalibrasyon ve üretime geçiş.',
      
      // Service 3 - Defense Projects
      'service3.subtitle': 'Kritik altyapı için stratejik gıda güvenliği çözümleri.',
      'service3.description': 'Savunma sanayi projelerimiz, kriz anlarında tedarik zincirinden bağımsız çalışabilen izole gıda üretim sistemleri sunar. Uzay görevleri ve kritik altyapılar için biyorejeneratif yaşam destek üniteleri geliştiriyoruz.',
      'service3.feature1.title': 'İzole Sistemler',
      'service3.feature1.desc': 'Dış bağımlılıklardan bağımsız, kapalı devre gıda üretim modülleri.',
      'service3.feature2.title': 'Biyogüvenlik',
      'service3.feature2.desc': 'Yüksek güvenlik standartlarına uygun kontrollü çevre sistemleri.',
      'service3.feature3.title': 'Uzay Teknolojileri',
      'service3.feature3.desc': 'Mars ve Ay kolonizasyonu için CELSS (Controlled Ecological Life Support Systems) sistemleri.',
      'service3.feature4.title': 'Dayanıklılık ve Güvenilirlik',
      'service3.feature4.desc': 'Aşırı koşullarda çalışabilen, yüksek dayanıklılığa sahip sistemler.',
      'service3.process1.title': 'Gereksinim Analizi',
      'service3.process1.desc': 'Operasyonel gereksinimlerin ve güvenlik standartlarının belirlenmesi.',
      'service3.process2.title': 'Özel Tasarım',
      'service3.process2.desc': 'Kritik altyapı gereksinimlerine özel sistem tasarımı.',
      'service3.process3.title': 'Test ve Validasyon',
      'service3.process3.desc': 'Kapsamlı testler ve sertifikasyon süreçleri.',
      'service3.process4.title': 'Entegrasyon ve Destek',
      'service3.process4.desc': 'Sistem entegrasyonu ve sürekli teknik destek.',
      
      // Service 4 - Consulting and Project Management
      'service4.subtitle': 'Stratejik danışmanlık ve kapsamlı proje yönetimi hizmetleri.',
      'service4.description': 'Nexus, tarım projelerinizin her aşamasında stratejik danışmanlık ve profesyonel proje yönetimi hizmetleri sunar. Deneyimli ekibimiz, projelerinizin zamanında, bütçe dahilinde ve en yüksek kalite standartlarında tamamlanmasını sağlar.',
      'service4.feature1.title': 'Stratejik Planlama',
      'service4.feature1.desc': 'Proje hedeflerinizin belirlenmesi ve uygulanabilir stratejilerin geliştirilmesi.',
      'service4.feature2.title': 'Risk Yönetimi',
      'service4.feature2.desc': 'Proje risklerinin önceden belirlenmesi ve etkili risk azaltma stratejileri.',
      'service4.feature3.title': 'Zaman ve Kaynak Yönetimi',
      'service4.feature3.desc': 'Proje zaman çizelgelerinin optimizasyonu ve kaynak kullanımının verimlileştirilmesi.',
      'service4.feature4.title': 'Kalite Güvencesi',
      'service4.feature4.desc': 'Proje çıktılarının kalite standartlarına uygunluğunun sağlanması ve sürekli iyileştirme.',
      'service4.process1.title': 'Proje Değerlendirme',
      'service4.process1.desc': 'Proje kapsamının analizi, hedeflerin belirlenmesi ve uygulanabilirlik çalışması.',
      'service4.process2.title': 'Strateji Geliştirme',
      'service4.process2.desc': 'Detaylı proje planlaması, kaynak tahsisi ve zaman çizelgesi oluşturma.',
      'service4.process3.title': 'Uygulama ve İzleme',
      'service4.process3.desc': 'Proje ilerlemesinin sürekli izlenmesi, performans değerlendirmesi ve gerekli düzeltmeler.',
      'service4.process4.title': 'Teslim ve Değerlendirme',
      'service4.process4.desc': 'Proje tamamlama, sonuçların değerlendirilmesi ve süreç iyileştirme önerileri.',
      
      // Team
      'team.title': 'EKİP',
      'team.subtitle': 'Nexus Biotechnologies ekibini tanıyın.',
      'team.emirhan.name': 'Emirhan Burul',
      'team.emirhan.description1': 'Emirhan Burul, kontrollü ortam tarımını ölçeklenebilir ve güvenilir altyapıya dönüştürmeye odaklanan bir sistem mühendisi ve biyoteknoloji eğitimli bir yapımcıdır. Münih Teknik Üniversitesi\'nden biyoteknoloji geçmişi ve veri odaklı üretim sistemlerini tasarlama ve işletme konusundaki pratik deneyimiyle, biyoloji, donanım ve yazılımı bir araya getiriyor—algılama, otomasyon, iklim stratejisi ve operasyonel iş akışlarını tek bir tutarlı üründe birleştiriyor.',
      'team.emirhan.description2': 'Nexus Biotechnologies\'te Emirhan, teknik vizyonu ilk prensiplerden yönetiyor: enerji ve operasyonel karmaşıklığı azaltırken tutarlılığı ve birim ekonomisini iyileştiren pratik sistemler inşa ediyor. Startup zihniyetiyle çalışıyor—hızlı üretim, her şeyi ölçme, durmaksızın yineleme—ve iddialı fikirleri gerçek müşterilerin her gün çalıştırabileceği dağıtılabilir çözümlere dönüştürmeye takıntılı.',
      
      // Footer
      'footer.tagline': 'ADVANCED AGRICULTURAL ENGINEERING AND BIOTECHNOLOGICAL DESIGN',
      'footer.copyright': '© 2026 NEXUS BIOTECHNOLOGIES. ISTANBUL.',
    },
    en: {
      // Navbar
      'nav.vision': 'VISION',
      'nav.technology': 'TECHNOLOGY',
      'nav.articles': 'ARTICLES',
      'nav.defense': 'DEFENSE',
      'nav.services': 'SERVICES',
      'nav.team': 'TEAM',
      'nav.contact': 'CONTACT',
      'nav.vision.mobile': 'Vision',
      'nav.technology.mobile': 'Technology',
      'nav.articles.mobile': 'Articles',
      'nav.defense.mobile': 'Defense',
      'nav.services.mobile': 'Services',
      'nav.team.mobile': 'Team',
      'nav.contact.mobile': 'Contact',
      
      // Hero
      'hero.title': 'MAKING FOOD ACCESIBLE',
      'hero.subtitle': 'Nexus provides controlled environment agriculture solutions that push the limits of efficiency in agricultural production.',
      'hero.button': 'Explore Technology',
      
      // Manifesto
      'manifesto.title': 'WE TAKE CONTROL',
      'manifesto.title2': 'OF THE FUTURE OF AGRICULTURE.',
      'manifesto.description': 'We approach biology as a technology platform. From vertical farms to open fields, our goal is to produce at physical limits with minimum input.',
      'manifesto.dataDriven': 'DATA-DRIVEN',
      'manifesto.dataDrivenDesc': 'The decision mechanism is not human, but algorithm.',
      'manifesto.scalable': 'SCALABLE',
      'manifesto.scalableDesc': 'Unlimited growth capacity with modular structures.',
      'manifesto.sustainable': 'SUSTAINABILITY',
      'manifesto.sustainableDesc': 'The same standard in every climate, every geography.',
      
      // Technology
      'tech.title': 'TECHNOLOGY',
      'tech.ai.tab': 'AI',
      'tech.hardware.tab': 'HARDWARE',
      'tech.ai.title': 'We Approach Agriculture as a System',
      'tech.ai.intro': 'Nexus Biotechnologies treats agriculture as an integrated system composed of physical hardware, sensing infrastructure, data, and artificial intelligence operating together across field agriculture, greenhouses, and controlled environments, including vertical farming.',
      'tech.ai.layer1.title': 'Physical Sensing and Infrastructure',
      'tech.ai.layer1.desc': 'Continuous monitoring across fields, greenhouses, and controlled environments. Real-time measurement of soil, air, climate, and crop parameters.',
      'tech.ai.layer2.title': 'Crop and Biological State Intelligence',
      'tech.ai.layer2.desc': 'Understanding plant physiological states. Deep analysis of growth, health, and productivity.',
      'tech.ai.layer3.title': 'Environment Translation',
      'tech.ai.layer3.desc': 'Knowledge transfer between fields, greenhouses, and controlled systems. Integration of data across environments.',
      'tech.ai.layer4.title': 'Resource Allocation and Optimization',
      'tech.ai.layer4.desc': 'Dynamic management of light, water, nutrients, and energy. Optimization according to each environment\'s specific requirements.',
      'tech.ai.layer5.title': 'Continuous Learning and Improvement',
      'tech.ai.layer5.desc': 'Ongoing evaluation of system performance. Operational intelligence that evolves and adapts over time.',
      'tech.oasis.name': 'OASIS',
      'tech.oasis.subtitle': 'VERTICAL FARMING INTEGRATION',
      'tech.oasis.description': 'Closed-loop systems. Maximum efficiency per photon. Ultra-dense architecture and vertical structuring for urban production.',
      'tech.oasis.details': '40% LIGHT SAVINGS // 98% WATER SAVINGS',
      'tech.aether.name': 'AETHER',
      'tech.aether.subtitle': 'CONTROLLED GREENHOUSE SYSTEMS',
      'tech.aether.description': 'Soilless farming greenhouses. Year-round standard, high yield with hybrid lighting and climate control algorithms.',
      'tech.aether.details': 'FULL CLIMATE CONTROL // HYBRID SPECTRUM',
      'tech.terra.name': 'TERRA',
      'tech.terra.subtitle': 'OPEN FIELD AUTONOMY',
      'tech.terra.description': 'Robotic enhancement for conventional agriculture. Satellite-supported yield prediction and AI-based resource management.',
      'tech.terra.details': 'DRONE IMAGE PROCESSING, FERTILIZATION AND SPRAYING',
      'tech.ecodome.name': 'ECODOME',
      'tech.ecodome.subtitle': 'SENSOR STATION',
      'tech.ecodome.description': 'Environmental monitoring and data collection unit. Continuously measures soil, air, and climate parameters. Provides real-time data to the AI system for operational decisions.',
      'tech.ecodome.details': 'REAL-TIME MONITORING // DATA COLLECTION',
      
      // Engineering
      'engineering.title': 'ARTICLES',
      'engineering.description': 'Explore the physics, systems and future of agriculture.',
      'engineering.comingSoon': 'Coming Soon...',
      
      // DefenseSpace
      'defense.title': 'CRITICAL INFRASTRUCTURE',
      'defense.subtitle': 'RESILIENT SYSTEMS',
      'defense.subtitle2': 'FOR CHALLENGING CONDITIONS.',
      'defense.defense': 'DEFENSE',
      'defense.defenseDesc': 'Isolated and secure food production modules independent of supply chains during crisis moments.',
      'defense.space': 'SPACE',
      'defense.spaceDesc': 'Controlled ecological life-support systems (CELSS) for Mars & Moon colonization and space missions.',
      
      // Services
      'services.title': 'SERVICES',
      'services.service1.title': 'Engineering Solutions',
      'services.service1.desc': 'Facility, field and site optimization.',
      'services.service2.title': 'Turnkey Projects',
      'services.service2.desc': 'End-to-end installation and integration.',
      'services.service3.title': 'Defense Industry Projects',
      'services.service3.desc': 'Strategic food and biosecurity solutions.',
      'services.service4.title': 'Consulting and Project Management',
      'services.service4.desc': 'Strategic consulting and comprehensive project management services.',
      'services.button': 'Get in Touch',
      'services.phoneLabel': 'Phone:',
      
      // Service Pages
      'servicePage.back': 'Back to Home',
      'servicePage.features': 'FEATURES',
      'servicePage.process': 'PROCESS',
      'servicePage.ctaTitle': 'START YOUR PROJECT',
      'servicePage.ctaDesc': 'Optimize your agricultural production with our engineering expertise.',
      
      // Service 1 - Engineering Solutions
      'service1.subtitle': 'Engineering solutions that increase efficiency in agricultural production.',
      'service1.description': 'Nexus offers a wide range of engineering services from facility design to site optimization. We help you achieve maximum yield by pushing the physical limits of controlled environment agriculture systems.',
      'service1.feature1.title': 'Facility Design',
      'service1.feature1.desc': 'Custom architectural and engineering solutions for vertical farms and controlled greenhouse systems.',
      'service1.feature2.title': 'Site Optimization',
      'service1.feature2.desc': 'Performance analysis of your existing facilities and efficiency-enhancing optimization recommendations.',
      'service1.feature3.title': 'Climate Control Systems',
      'service1.feature3.desc': 'Integration of hybrid lighting, ventilation and climate control systems.',
      'service1.feature4.title': 'Data Analysis and Modeling',
      'service1.feature4.desc': 'AI-supported yield prediction and resource management algorithms.',
      'service1.process1.title': 'Needs Analysis',
      'service1.process1.desc': 'Detailed analysis of your current situation and goal setting.',
      'service1.process2.title': 'Design and Planning',
      'service1.process2.desc': 'Design of custom engineering solutions and implementation planning.',
      'service1.process3.title': 'Implementation and Integration',
      'service1.process3.desc': 'Installation of systems and integration with existing infrastructure.',
      'service1.process4.title': 'Optimization and Support',
      'service1.process4.desc': 'Continuous performance monitoring and system optimization.',
      
      // Service 2 - Turnkey Projects
      'service2.subtitle': 'Fully integrated agricultural systems from start to finish.',
      'service2.description': 'Our turnkey projects cover the entire process from concept to production. We enable you to build an agricultural facility from scratch using Nexus technologies.',
      'service2.feature1.title': 'Full Integration',
      'service2.feature1.desc': 'Seamless integration of OASIS, AETHER and TERRA systems.',
      'service2.feature2.title': 'Custom Architecture',
      'service2.feature2.desc': 'Facility architecture and infrastructure designed specifically for your needs.',
      'service2.feature3.title': 'Automation Systems',
      'service2.feature3.desc': 'Fully automated harvest, irrigation and climate control systems.',
      'service2.feature4.title': 'Training and Documentation',
      'service2.feature4.desc': 'Staff training and comprehensive technical documentation.',
      'service2.process1.title': 'Concept Development',
      'service2.process1.desc': 'Determining project scope and concept design.',
      'service2.process2.title': 'Engineering and Design',
      'service2.process2.desc': 'Detailed engineering drawings and system specifications.',
      'service2.process3.title': 'Construction and Installation',
      'service2.process3.desc': 'Facility construction and installation of all systems.',
      'service2.process4.title': 'Commissioning',
      'service2.process4.desc': 'System tests, calibration and transition to production.',
      
      // Service 3 - Defense Projects
      'service3.subtitle': 'Strategic food security solutions for critical infrastructure.',
      'service3.description': 'Our defense industry projects offer isolated food production systems that can operate independently of supply chains during crisis moments. We develop bioregenerative life support units for space missions and critical infrastructure.',
      'service3.feature1.title': 'Isolated Systems',
      'service3.feature1.desc': 'Closed-loop food production modules independent of external dependencies.',
      'service3.feature2.title': 'Biosecurity',
      'service3.feature2.desc': 'Controlled environment systems compliant with high security standards.',
      'service3.feature3.title': 'Space Technologies',
      'service3.feature3.desc': 'CELSS (Controlled Ecological Life Support Systems) systems for Mars and Moon colonization.',
      'service3.feature4.title': 'Resilience and Reliability',
      'service3.feature4.desc': 'Systems capable of operating under extreme conditions with high durability.',
      'service3.process1.title': 'Requirements Analysis',
      'service3.process1.desc': 'Determining operational requirements and security standards.',
      'service3.process2.title': 'Custom Design',
      'service3.process2.desc': 'System design specific to critical infrastructure requirements.',
      'service3.process3.title': 'Testing and Validation',
      'service3.process3.desc': 'Comprehensive testing and certification processes.',
      'service3.process4.title': 'Integration and Support',
      'service3.process4.desc': 'System integration and continuous technical support.',
      
      // Service 4 - Consulting and Project Management
      'service4.subtitle': 'Strategic consulting and comprehensive project management services.',
      'service4.description': 'Nexus provides strategic consulting and professional project management services at every stage of your agricultural projects. Our experienced team ensures your projects are completed on time, within budget, and to the highest quality standards.',
      'service4.feature1.title': 'Strategic Planning',
      'service4.feature1.desc': 'Defining project objectives and developing actionable strategies.',
      'service4.feature2.title': 'Risk Management',
      'service4.feature2.desc': 'Early identification of project risks and effective risk mitigation strategies.',
      'service4.feature3.title': 'Time and Resource Management',
      'service4.feature3.desc': 'Optimization of project timelines and efficient resource utilization.',
      'service4.feature4.title': 'Quality Assurance',
      'service4.feature4.desc': 'Ensuring project outputs meet quality standards and continuous improvement.',
      'service4.process1.title': 'Project Assessment',
      'service4.process1.desc': 'Analysis of project scope, goal setting and feasibility study.',
      'service4.process2.title': 'Strategy Development',
      'service4.process2.desc': 'Detailed project planning, resource allocation and timeline creation.',
      'service4.process3.title': 'Implementation and Monitoring',
      'service4.process3.desc': 'Continuous monitoring of project progress, performance evaluation and necessary adjustments.',
      'service4.process4.title': 'Delivery and Evaluation',
      'service4.process4.desc': 'Project completion, evaluation of results and process improvement recommendations.',
      
      // Team
      'team.title': 'TEAM',
      'team.subtitle': 'Meet the Nexus Biotechnologies team.',
      'team.emirhan.name': 'Emirhan Burul',
      'team.emirhan.description1': 'Emirhan Burul is a systems engineer and biotechnology-trained builder focused on turning controlled-environment agriculture into scalable, reliable infrastructure. With a biotech background from Technical University of Munich and hands-on experience designing and operating data-driven production systems, he bridges biology, hardware, and software—bringing together sensing, automation, climate strategy, and operational workflows into one coherent product.',
      'team.emirhan.description2': 'At Nexus Biotechnologies, Emirhan leads the technical vision from first principles: building practical systems that reduce energy and operational complexity while improving consistency and unit economics. He operates with a startup mindset—ship fast, measure everything, iterate relentlessly—and is obsessed with turning ambitious ideas into deployable solutions that real customers can run every day.',
      
      // Footer
      'footer.tagline': 'ADVANCED AGRICULTURAL ENGINEERING AND BIOTECHNOLOGICAL DESIGN',
      'footer.copyright': '© 2026 NEXUS BIOTECHNOLOGIES. ISTANBUL.',
    },
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
