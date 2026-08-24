export const BIRTHDAY_CONFIG = {
  name: 'Priya',
  birthMonth: 8,
  birthDate: 29,
  birthYear: 2000,
  targetYear: 2026,
};

export const BACKGROUND = {
  src: '/photos/site-background.jpeg',
  position: 'center bottom',
};

export const PHOTOS = [
  {
    src: '/photos/birthday-celebration.png',
    caption: 'That smile on your birthday ✨',
    rotate: -3,
  },
  {
    src: '/photos/our-memory.png',
    caption: 'Us, always 💫',
    rotate: 2,
  },
];

// Replace these lines with your own shyari whenever you like.
export const SHYARI = {
  title: 'For You, Priya',
  lines: [
    'অপেক্ষার পথে খুশির বার্তা আসে,',
    'পিহুর জন্মদিন এলো, রঙিন ভালোবাসায়।',
    'নতুন অতিথি আমি, তোমার মনের ঘরে,',
    'বাকি পথটুকু চলব, তোমার হাত ধরে।',
    'জন্মদিন আসুক নিয়ে, এক নতুন প্রভাত,',
    'সারাজীবন পাশে থেকে, দিও তোমার হাত!',
  ],
};

export const SONG = {
  src: '/music/our-song.mp3',
  title: 'Our Song',
  subtitle: 'Playing just for you',
};

export const DAILY_SURPRISES = [
  {
    date: '2026-08-24',
    background: BACKGROUND,
    photos: PHOTOS,
    shyari: {
      title: 'For You, Priya',
      lines: [
        'আর কিছু সকাল, তারপর তোমার দিন,',
        'মন ভরে সাজাবো ভালোবাসার রঙিন।',
        'এই ছবির হাসিটা থাকুক পাশে আজ,',
        'তোমায় ঘিরেই শুরু আমার সব কাজ।',
      ],
    },
    song: {
      ...SONG,
      title: 'Daily Surprise',
      subtitle: 'A little beginning before your birthday',
    },
  },
  {
    date: '2026-08-25',
    background: BACKGROUND,
    photos: PHOTOS,
    shyari: {
      title: 'For You, Priya',
      lines: [
        'অপেক্ষার পথে মন আজ উড়ে,',
        'তোমার কথাই আসে নরম নীল সুরে।',
        'জন্মদিন আসুক আলোর মতো ধীরে,',
        'তুমি থাকো আমার প্রতিটি প্রার্থনায় ফিরে।',
      ],
    },
    song: {
      ...SONG,
      title: 'Daily Surprise',
      subtitle: 'Swap this MP3 when you add tomorrow’s song',
    },
  },
  {
    date: '2026-08-26',
    background: BACKGROUND,
    photos: PHOTOS,
    shyari: {
      title: 'For You, Priya',
      lines: [
        'জন্মদিনের সকাল কাছে আসছে ধীরে,',
        'আমার সব শুভেচ্ছা তোমার পথে রবে।',
        'হাসির ভাঁজে রাখবো ছোট্ট স্বপ্নখানি,',
        'তুমি এলে জীবন হয় নতুন গল্প জানি।',
      ],
    },
    song: {
      ...SONG,
      title: 'Daily Surprise',
      subtitle: 'A soft song for the middle of the wait',
    },
  },
  {
    date: '2026-08-27',
    background: BACKGROUND,
    photos: PHOTOS,
    shyari: {
      title: 'For You, Priya',
      lines: [
        'অপেক্ষার দূরত্বে আনন্দের ঢেউ,',
        'তোমার হাসির কাছে হার মানে সব কেউ।',
        'চোখের তারায় রাখি জন্মদিনের আলো,',
        'তোমার জন্যই পৃথিবী লাগে ভালো।',
      ],
    },
    song: {
      ...SONG,
      title: 'Daily Surprise',
      subtitle: 'Nearly time for the big smile',
    },
  },
  {
    date: '2026-08-28',
    background: BACKGROUND,
    photos: PHOTOS,
    shyari: {
      title: 'For You, Priya',
      lines: [
        'শেষ রাতের স্বপ্ন জাগে মনে,',
        'শুভেচ্ছা জমিয়েছি তোমারই কারণে।',
        'কালকের সকাল হবে শুধু তোমার নাম,',
        'ভালোবাসা লিখবো আকাশ ভরে অবিরাম।',
      ],
    },
    song: {
      ...SONG,
      title: 'Daily Surprise',
      subtitle: 'The last song before birthday morning',
    },
  },
  {
    date: '2026-08-29',
    background: BACKGROUND,
    photos: PHOTOS,
    shyari: {
      title: 'Happy Birthday',
      lines: [
        'আজ তোমার দিন, আলোয় ভরা সকাল,',
        'তোমার হাসিতে মুছে যাক সব জঞ্জাল।',
        'জন্মদিনে চাই শুধু এই আশীর্বাদ,',
        'আমার পাশে থেকো তুমি সারাজীবন অবিরাম।',
      ],
    },
    song: {
      ...SONG,
      title: 'Birthday Surprise',
      subtitle: 'Today is yours',
    },
  },
];

export const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getBirthdayTarget = (date = new Date(), config = BIRTHDAY_CONFIG) => {
  const year = config.targetYear ?? date.getFullYear();
  return new Date(year, config.birthMonth - 1, config.birthDate, 0, 0, 0, 0);
};

export const getBirthdayCountdownTitle = (date = new Date(), config = BIRTHDAY_CONFIG) => {
  const target = getBirthdayTarget(date, config);
  const difference = target.getTime() - date.getTime();

  if (getLocalDateKey(date) === getLocalDateKey(target)) {
    return 'Happy Birthday';
  }

  if (difference <= 0) {
    return 'Birthday Celebration';
  }

  const days = Math.floor(difference / 86400000);

  if (days <= 0) {
    return 'Less Than 1 Day To Go';
  }

  return `${days} ${days === 1 ? 'Day' : 'Days'} To Go`;
};

const withCountdownTitle = (shyari, date) => ({
  ...shyari,
  title: getBirthdayCountdownTitle(date),
});

export const getDailyContent = (date = new Date()) => {
  const todayKey = getLocalDateKey(date);

  if (DAILY_SURPRISES.length === 0) {
    return {
      config: BIRTHDAY_CONFIG,
      background: BACKGROUND,
      photos: PHOTOS,
      shyari: withCountdownTitle(SHYARI, date),
      song: SONG,
      surpriseDate: todayKey,
    };
  }

  const exactSurprise = DAILY_SURPRISES.find((surprise) => surprise.date === todayKey);

  if (exactSurprise) {
    return {
      config: BIRTHDAY_CONFIG,
      background: exactSurprise.background ?? BACKGROUND,
      photos: exactSurprise.photos ?? PHOTOS,
      shyari: withCountdownTitle(exactSurprise.shyari ?? SHYARI, date),
      song: exactSurprise.song ?? SONG,
      surpriseDate: exactSurprise.date,
    };
  }

  const firstSurpriseDate = parseLocalDateKey(DAILY_SURPRISES[0].date);
  const today = parseLocalDateKey(todayKey);
  const dayOffset = Math.floor((today - firstSurpriseDate) / 86400000);
  const surpriseIndex = Math.min(
    Math.max(dayOffset, 0),
    DAILY_SURPRISES.length - 1
  );
  const fallbackSurprise = DAILY_SURPRISES[surpriseIndex];

  return {
    config: BIRTHDAY_CONFIG,
    background: fallbackSurprise?.background ?? BACKGROUND,
    photos: fallbackSurprise?.photos ?? PHOTOS,
    shyari: withCountdownTitle(fallbackSurprise?.shyari ?? SHYARI, date),
    song: fallbackSurprise?.song ?? SONG,
    surpriseDate: fallbackSurprise?.date ?? todayKey,
  };
};
