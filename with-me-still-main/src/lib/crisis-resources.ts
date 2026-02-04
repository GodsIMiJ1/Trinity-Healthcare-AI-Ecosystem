// International crisis resources - location-aware
export interface CrisisResource {
  country: string;
  countryCode: string;
  hotlines: {
    name: string;
    phone: string;
    description?: string;
    hours?: string;
    url?: string;
  }[];
  emergencyNumber: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    country: "United States",
    countryCode: "US",
    emergencyNumber: "911",
    hotlines: [
      {
        name: "988 Suicide & Crisis Lifeline",
        phone: "988",
        description: "Free, confidential support 24/7",
        hours: "24/7",
        url: "https://988lifeline.org",
      },
      {
        name: "Crisis Text Line",
        phone: "Text HOME to 741741",
        description: "Free crisis counseling via text",
        hours: "24/7",
      },
    ],
  },
  {
    country: "United Kingdom",
    countryCode: "GB",
    emergencyNumber: "999",
    hotlines: [
      {
        name: "Samaritans",
        phone: "116 123",
        description: "Free emotional support",
        hours: "24/7",
        url: "https://www.samaritans.org",
      },
      {
        name: "Shout",
        phone: "Text SHOUT to 85258",
        description: "Free crisis text service",
        hours: "24/7",
      },
    ],
  },
  {
    country: "Canada",
    countryCode: "CA",
    emergencyNumber: "911",
    hotlines: [
      {
        name: "988 Suicide Crisis Helpline",
        phone: "988",
        description: "National crisis line",
        hours: "24/7",
      },
      {
        name: "Crisis Text Line",
        phone: "Text CONNECT to 686868",
        description: "Free crisis support via text",
        hours: "24/7",
      },
    ],
  },
  {
    country: "Australia",
    countryCode: "AU",
    emergencyNumber: "000",
    hotlines: [
      {
        name: "Lifeline",
        phone: "13 11 14",
        description: "Crisis support and suicide prevention",
        hours: "24/7",
        url: "https://www.lifeline.org.au",
      },
      {
        name: "Beyond Blue",
        phone: "1300 22 4636",
        description: "Anxiety, depression, and suicide prevention",
        hours: "24/7",
        url: "https://www.beyondblue.org.au",
      },
    ],
  },
  {
    country: "Germany",
    countryCode: "DE",
    emergencyNumber: "112",
    hotlines: [
      {
        name: "Telefonseelsorge",
        phone: "0800 111 0 111",
        description: "Free crisis counseling",
        hours: "24/7",
      },
      {
        name: "Telefonseelsorge (Catholic)",
        phone: "0800 111 0 222",
        description: "Free crisis counseling",
        hours: "24/7",
      },
    ],
  },
  {
    country: "France",
    countryCode: "FR",
    emergencyNumber: "112",
    hotlines: [
      {
        name: "SOS Amitié",
        phone: "09 72 39 40 50",
        description: "Suicide prevention hotline",
        hours: "24/7",
        url: "https://www.sos-amitie.com",
      },
    ],
  },
  {
    country: "India",
    countryCode: "IN",
    emergencyNumber: "112",
    hotlines: [
      {
        name: "AASRA",
        phone: "91-22-27546669",
        description: "Crisis intervention center",
        hours: "24/7",
        url: "http://www.aasra.info",
      },
      {
        name: "iCall",
        phone: "9152987821",
        description: "Psychosocial helpline",
      },
    ],
  },
  {
    country: "Japan",
    countryCode: "JP",
    emergencyNumber: "110",
    hotlines: [
      {
        name: "TELL Lifeline",
        phone: "03-5774-0992",
        description: "English-language crisis support",
        hours: "9am-11pm",
        url: "https://telljp.com",
      },
      {
        name: "Yorisoi Hotline",
        phone: "0120-279-338",
        description: "Free multilingual support",
        hours: "24/7",
      },
    ],
  },
  {
    country: "Brazil",
    countryCode: "BR",
    emergencyNumber: "190",
    hotlines: [
      {
        name: "CVV",
        phone: "188",
        description: "Centro de Valorização da Vida",
        hours: "24/7",
        url: "https://www.cvv.org.br",
      },
    ],
  },
  {
    country: "International",
    countryCode: "INTL",
    emergencyNumber: "112",
    hotlines: [
      {
        name: "International Association for Suicide Prevention",
        phone: "See website for local resources",
        description: "Find crisis centers worldwide",
        url: "https://www.iasp.info/resources/Crisis_Centres/",
      },
      {
        name: "Befrienders Worldwide",
        phone: "See website",
        description: "Emotional support in 32 countries",
        url: "https://www.befrienders.org",
      },
    ],
  },
];

export function getResourcesByCountry(countryCode: string): CrisisResource {
  const resource = CRISIS_RESOURCES.find(r => r.countryCode === countryCode);
  return resource || CRISIS_RESOURCES.find(r => r.countryCode === "INTL")!;
}

export function getCountryOptions() {
  return CRISIS_RESOURCES
    .filter(r => r.countryCode !== "INTL")
    .map(r => ({
      value: r.countryCode,
      label: r.country,
    }));
}

// Crisis detection keywords and phrases
export const CRISIS_SIGNALS = {
  severe: [
    "i want to die",
    "i want to kill myself",
    "i'm going to kill myself",
    "i don't want to live",
    "i don't want to be here anymore",
    "i wish i was dead",
    "i wish i were dead",
    "end my life",
    "suicide",
    "kill myself",
    "want to die",
    "better off dead",
    "no reason to live",
    "can't go on",
    "rather be dead",
  ],
  moderate: [
    "i can't do this anymore",
    "i give up",
    "there's no point",
    "hopeless",
    "i'm a burden",
    "everyone would be better off without me",
    "no way out",
    "can't take it anymore",
    "self harm",
    "hurt myself",
    "cutting",
  ],
};

export function detectCrisisSignals(message: string): {
  isCrisis: boolean;
  severity: "severe" | "moderate" | null;
  signals: string[];
} {
  const lowerMessage = message.toLowerCase();
  const detectedSignals: string[] = [];
  
  // Check severe signals first
  for (const signal of CRISIS_SIGNALS.severe) {
    if (lowerMessage.includes(signal)) {
      detectedSignals.push(signal);
    }
  }
  
  if (detectedSignals.length > 0) {
    return { isCrisis: true, severity: "severe", signals: detectedSignals };
  }
  
  // Check moderate signals
  for (const signal of CRISIS_SIGNALS.moderate) {
    if (lowerMessage.includes(signal)) {
      detectedSignals.push(signal);
    }
  }
  
  if (detectedSignals.length > 0) {
    return { isCrisis: true, severity: "moderate", signals: detectedSignals };
  }
  
  return { isCrisis: false, severity: null, signals: [] };
}
