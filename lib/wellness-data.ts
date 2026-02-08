// Static wellness content organized by category: Physical, Spiritual, Mental

export interface WellnessTopic {
  id: string
  title: string
  emoji: string
  content: string
  items?: { title: string; desc: string }[]
}

export interface WellnessCategory {
  id: string
  label: string
  emoji: string
  description: string
  gradient: string
  borderColor: string
  bgLight: string
  textColor: string
  iconBg: string
  topics: WellnessTopic[]
}

export const EGYPTIAN_MEALS: { day: number; name: string; nameAr: string; desc: string }[] = [
  { day: 1, name: 'Fattah', nameAr: 'فتة', desc: 'Layers of crispy bread, rice, and slow-cooked beef in a tangy tomato-vinegar garlic sauce. The ultimate Ramadan celebration dish.' },
  { day: 2, name: 'Molokhia with Chicken', nameAr: 'ملوخية بالفراخ', desc: 'Finely chopped jute leaves cooked with garlic and coriander broth, served over white rice with roasted chicken.' },
  { day: 3, name: 'Mahshi (Stuffed Vegetables)', nameAr: 'محشي', desc: 'Vine leaves, zucchini, peppers, and cabbage stuffed with seasoned rice, herbs, and tomato. A labor of love.' },
  { day: 4, name: 'Koshari', nameAr: 'كشري', desc: 'Egypt\'s national dish — rice, lentils, macaroni, and chickpeas topped with spicy tomato sauce and crispy fried onions.' },
  { day: 5, name: 'Bamia (Okra Stew)', nameAr: 'بامية', desc: 'Tender okra pods slow-cooked in a rich tomato-based stew with beef or lamb, served with fluffy white rice.' },
  { day: 6, name: 'Kofta with Tahini', nameAr: 'كفتة بالطحينة', desc: 'Seasoned ground beef kofta baked in a creamy tahini sauce with potatoes. Comfort food at its finest.' },
  { day: 7, name: 'Sayadeya (Fish & Rice)', nameAr: 'صيادية', desc: 'Fried fish served on a bed of golden onion-infused rice with a spiced tomato sauce. A coastal Egyptian classic.' },
  { day: 8, name: 'Hamam Mahshi (Stuffed Pigeon)', nameAr: 'حمام محشي', desc: 'Whole pigeons stuffed with seasoned freekeh (smoked green wheat) or rice, roasted until golden and crispy.' },
  { day: 9, name: 'Hawawshi', nameAr: 'حواوشي', desc: 'Spiced minced meat stuffed inside Egyptian baladi bread and baked until crispy. Egyptian meat pie perfection.' },
  { day: 10, name: 'Mulukhiyah with Rabbit', nameAr: 'ملوخية بالأرانب', desc: 'The premium version of molokhia — made with rabbit broth for an incredibly rich and silky stew.' },
  { day: 11, name: 'Béchamel Pasta', nameAr: 'مكرونة بشاميل', desc: 'Penne pasta layered with spiced ground beef and creamy béchamel sauce, baked until golden and bubbly.' },
  { day: 12, name: 'Dawoud Basha', nameAr: 'داوود باشا', desc: 'Small meatballs simmered in a rich tomato sauce with pine nuts. Named after an Ottoman governor of Egypt.' },
  { day: 13, name: 'Ful Medames', nameAr: 'فول مدمس', desc: 'Slow-cooked fava beans mashed with lemon, garlic, cumin, and olive oil. Serve with eggs and fresh bread for a hearty Suhoor.' },
  { day: 14, name: "Ta'ameya (Egyptian Falafel)", nameAr: 'طعمية', desc: 'Made with fava beans (not chickpeas!), herbs, and spices. Crispy outside, bright green inside. Serve with tahini.' },
  { day: 15, name: 'Torly (Vegetable Casserole)', nameAr: 'طرلي', desc: 'A colorful baked casserole of sliced potatoes, zucchini, tomatoes, peppers, and onions in a seasoned tomato sauce.' },
  { day: 16, name: 'Kebab & Kofta Mashwi', nameAr: 'كباب وكفتة مشوي', desc: 'Charcoal-grilled cubes of marinated lamb (kebab) and spiced minced meat skewers (kofta) with grilled vegetables.' },
  { day: 17, name: 'Shawarma Plate', nameAr: 'شاورما', desc: 'Thinly sliced marinated chicken or beef with garlic sauce, pickles, and fresh bread. A festive Iftar option.' },
  { day: 18, name: 'Roz Moammar (Baked Rice)', nameAr: 'رز معمر', desc: 'Creamy Egyptian rice baked in the oven with butter and milk until a golden crust forms on top. Rich and indulgent.' },
  { day: 19, name: 'Fatta Betingan (Eggplant Fattah)', nameAr: 'فتة باذنجان', desc: 'Fried eggplant layered with bread, rice, and a tomato-vinegar sauce. A lighter vegetarian twist on classic fattah.' },
  { day: 20, name: 'Mombar', nameAr: 'ممبار', desc: 'Beef intestines stuffed with a spiced rice and herb mixture, boiled then fried until crispy. A beloved delicacy.' },
  { day: 21, name: 'Tagen (Clay Pot Stew)', nameAr: 'طاجن', desc: 'Slow-cooked in a clay pot — can be meat with vegetables, or kofta with potatoes in tomato sauce. Rustic and hearty.' },
  { day: 22, name: 'Samak Mashwi (Grilled Fish)', nameAr: 'سمك مشوي', desc: 'Whole fish marinated with cumin, lemon, and herbs, grilled over charcoal. Served with rice and tahini salad.' },
  { day: 23, name: 'Feteer Meshaltet', nameAr: 'فطير مشلتت', desc: 'Flaky, buttery layered pastry — can be savory (with cheese, meat) or sweet (with honey, cream). Egyptian croissant!' },
  { day: 24, name: 'Fatta with Chickpeas', nameAr: 'فتة حمص', desc: 'A Levantine-Egyptian fusion — toasted bread topped with chickpeas, yogurt sauce, pine nuts, and warm spiced butter.' },
  { day: 25, name: 'Rokak (Thin Pastry Pie)', nameAr: 'رقاق', desc: 'Paper-thin pastry sheets layered with spiced minced meat, onions, and broth. Baked until crispy. Ramadan special.' },
  { day: 26, name: 'Freekeh with Chicken', nameAr: 'فريكة بالفراخ', desc: 'Smoky cracked green wheat cooked with chicken broth and topped with roasted chicken pieces. Nutritious and filling.' },
  { day: 27, name: 'Shakshuka', nameAr: 'شكشوكة', desc: 'Eggs poached in a spiced tomato and pepper sauce with onions and garlic. Perfect for a quick and satisfying Suhoor.' },
  { day: 28, name: 'Lentil Soup (Shorbet Ads)', nameAr: 'شوربة عدس', desc: 'Creamy red lentil soup with cumin, lemon, and crispy croutons. The quintessential Ramadan Iftar starter.' },
  { day: 29, name: 'Koshary el Sayed', nameAr: 'كشري السيد', desc: 'Elevated koshari with added liver or grilled meat on top, extra crispy onions, and special dakka (hot sauce).' },
  { day: 30, name: 'Fattah Celebration Feast', nameAr: 'فتة العيد', desc: 'Grand fattah for the last night — premium beef, extra garlic vinegar sauce, toasted nuts. The perfect Ramadan finale!' },
]

export const WELLNESS_CATEGORIES: WellnessCategory[] = [
  {
    id: 'physical',
    label: 'Physical',
    emoji: '💪',
    description: 'Body health, nutrition & energy',
    gradient: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-200',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
    topics: [
      {
        id: 'hydration',
        title: 'Hydration & Energy',
        emoji: '💧',
        content: 'Staying hydrated during Ramadan is crucial for maintaining energy and focus throughout the day.',
        items: [
          { title: 'Drink 8-10 glasses between Iftar and Suhoor', desc: 'Spread your water intake across the non-fasting hours. Keep a bottle with you and sip frequently.' },
          { title: 'Avoid caffeine and sugary drinks at Suhoor', desc: 'These are diuretics that increase water loss. Opt for water, milk, or natural juices instead.' },
          { title: 'Eat water-rich foods', desc: 'Watermelon, cucumber, tomatoes, and oranges help keep you hydrated during fasting hours.' },
          { title: 'Start Iftar with dates and water', desc: 'Following the Sunnah, dates provide quick natural energy while water begins rehydration.' },
          { title: 'Limit salty foods at Suhoor', desc: 'Excess salt increases thirst during the day. Season with herbs and lemon instead.' },
        ],
      },
      {
        id: 'exercise',
        title: 'Exercise During Ramadan',
        emoji: '🏃',
        content: 'Light to moderate exercise is beneficial during Ramadan, but timing and intensity matter.',
        items: [
          { title: 'Best time: 1 hour before Iftar', desc: 'You can hydrate and eat soon after. Your body uses fat stores for energy at this time.' },
          { title: 'Alternative: 2 hours after Iftar', desc: 'Your body has had time to digest and you\'re hydrated. Good for moderate-intensity workouts.' },
          { title: 'Keep it light during fasting hours', desc: 'Walking, gentle yoga, and stretching are ideal. Save intense workouts for after Iftar.' },
          { title: 'Listen to your body', desc: 'If you feel dizzy or weak, stop immediately. Ramadan is not the time to push limits.' },
          { title: '20-30 minutes is enough', desc: 'Short, consistent sessions are better than long exhausting ones during the holy month.' },
        ],
      },
      {
        id: 'sleep',
        title: 'Sleep & Rest',
        emoji: '😴',
        content: 'Quality sleep is essential during Ramadan. Adjust your schedule to get enough rest.',
        items: [
          { title: 'Aim for 6-8 hours total', desc: 'Split into a main sleep and a short nap if needed. Consistency helps your body adapt.' },
          { title: 'Take a 20-minute power nap after Dhuhr', desc: 'A short afternoon nap can restore energy without disrupting nighttime sleep.' },
          { title: 'Avoid heavy meals right before bed', desc: 'Eat your main Iftar meal, then have Suhoor lighter to improve sleep quality.' },
          { title: 'Create a dark, cool environment', desc: 'Use blackout curtains and keep the room cool for better sleep quality.' },
          { title: 'Limit screen time before sleep', desc: 'Blue light from screens disrupts melatonin. Try reading Quran or a book instead.' },
        ],
      },
      {
        id: 'meals',
        title: '30 Egyptian Ramadan Meals',
        emoji: '🍽️',
        content: 'A complete guide to 30 authentic Egyptian dishes — one for each day of Ramadan. From classic fattah to hearty koshari, these are the flavors of Egyptian Ramadan.',
        items: [],
      },
    ],
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    emoji: '🕌',
    description: 'Faith, prayer & inner peace',
    gradient: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-200',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    iconBg: 'bg-indigo-100',
    topics: [
      {
        id: 'prayer',
        title: 'Prayer & Reflection',
        emoji: '🤲',
        content: 'Ramadan is the perfect time to deepen your connection with Allah through prayer and reflection.',
        items: [
          { title: 'Pray all 5 daily prayers on time', desc: 'Use Ramadan as a chance to build consistency. Set reminders and create a peaceful prayer corner.' },
          { title: 'Add Sunnah prayers', desc: 'The optional Sunnah prayers before and after obligatory ones multiply your rewards during Ramadan.' },
          { title: 'Pray Taraweeh every night', desc: 'Whether at the mosque or at home, Taraweeh prayers are a beautiful Ramadan tradition that brings immense peace.' },
          { title: 'Make Dua before breaking fast', desc: 'The moment before Iftar is one of the most powerful times for dua (supplication). Keep a list of your duas.' },
          { title: 'Wake up for Tahajjud', desc: 'The last third of the night is the most blessed time. Even 2 rakaat before Suhoor can transform your Ramadan.' },
        ],
      },
      {
        id: 'quran',
        title: 'Quran Reading',
        emoji: '📖',
        content: 'Ramadan is the month the Quran was revealed. Make it your goal to connect deeply with the Book of Allah.',
        items: [
          { title: 'Set a daily Quran goal', desc: 'One juz (part) per day lets you complete the Quran during Ramadan. Even a few pages daily is rewarding.' },
          { title: 'Read with understanding', desc: 'Use a translation alongside the Arabic. Understanding the meaning deepens your connection.' },
          { title: 'Listen during commute or chores', desc: 'Play Quran recitation while driving, cooking, or doing housework. Every moment can be spiritual.' },
          { title: 'Attend or watch Tafseer sessions', desc: 'Understanding the context and deeper meanings of verses enriches your recitation.' },
          { title: 'Teach someone a verse', desc: 'Sharing Quran knowledge multiplies rewards. Teach your children or friends a new verse each day.' },
        ],
      },
      {
        id: 'charity',
        title: 'Charity & Giving',
        emoji: '🤝',
        content: 'Generosity is a cornerstone of Ramadan. Every act of giving, big or small, is multiplied in reward.',
        items: [
          { title: 'Feed someone for Iftar', desc: 'Providing food for someone to break their fast earns you the same reward as their fasting.' },
          { title: 'Calculate and pay your Zakat', desc: 'Many Muslims pay their yearly Zakat during Ramadan for multiplied rewards. Use online calculators to determine your amount.' },
          { title: 'Give Sadaqah daily', desc: 'Even a small daily donation adds up. Set up automatic daily donations to a trusted charity.' },
          { title: 'Donate to Zakat al-Fitr before Eid', desc: 'This is obligatory for every Muslim. Pay it before Eid prayer to ensure it reaches those in need.' },
          { title: 'Volunteer your time', desc: 'Help at community Iftars, food banks, or mosques. Your time is one of the most valuable things you can give.' },
        ],
      },
      {
        id: 'patience',
        title: 'Patience & Gratitude',
        emoji: '🌟',
        content: 'Fasting teaches patience (sabr) and gratitude (shukr). These virtues extend far beyond Ramadan.',
        items: [
          { title: 'Practice sabr in daily challenges', desc: 'When hunger, thirst, or fatigue test you, remember that patience is the essence of fasting.' },
          { title: 'Keep a gratitude journal', desc: 'Write down 3 things you\'re grateful for each day. This shifts your focus from what you lack to what you have.' },
          { title: 'Control your anger', desc: 'The Prophet (PBUH) said: "If someone insults you while fasting, say I am fasting." Practice restraint.' },
          { title: 'Appreciate your blessings at Iftar', desc: 'Before eating, pause and truly feel gratitude for the food before you. Many don\'t have this privilege.' },
          { title: 'Be patient with family', desc: 'Ramadan can be tiring for everyone. Show extra patience and kindness to those closest to you.' },
        ],
      },
    ],
  },
  {
    id: 'mental',
    label: 'Mental',
    emoji: '🧠',
    description: 'Mind, focus & well-being',
    gradient: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-200',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    iconBg: 'bg-sky-100',
    topics: [
      {
        id: 'stress',
        title: 'Managing Stress',
        emoji: '🧘',
        content: 'Ramadan schedule changes can increase stress. Learn to manage it effectively for a peaceful month.',
        items: [
          { title: 'Plan your day the night before', desc: 'Knowing what to expect reduces anxiety. Write a simple schedule for tomorrow before you sleep.' },
          { title: 'Don\'t overcommit socially', desc: 'It\'s okay to decline invitations. Protect your energy for worship and essential responsibilities.' },
          { title: 'Practice deep breathing', desc: '4-7-8 breathing: Inhale 4 seconds, hold 7, exhale 8. Do this when you feel overwhelmed during fasting.' },
          { title: 'Simplify meal prep', desc: 'Batch cook, use slow cookers, and plan weekly menus. Don\'t spend all your energy on elaborate Iftars daily.' },
          { title: 'Take breaks at work', desc: 'Short 5-minute breaks every hour help maintain focus and reduce stress when fasting.' },
        ],
      },
      {
        id: 'focus',
        title: 'Staying Focused at Work',
        emoji: '🎯',
        content: 'Maintaining productivity at work while fasting requires strategy and self-awareness.',
        items: [
          { title: 'Tackle important tasks early', desc: 'Your energy and focus are usually best in the morning after Suhoor. Schedule demanding work then.' },
          { title: 'Break work into small chunks', desc: 'Use the Pomodoro technique: 25 minutes of focus, 5 minutes rest. It\'s easier to manage while fasting.' },
          { title: 'Communicate with your team', desc: 'Let colleagues know you\'re fasting. Most people are understanding and can adjust meeting times if needed.' },
          { title: 'Keep your workspace organized', desc: 'A tidy desk reduces mental clutter. Spend 5 minutes each morning organizing your space.' },
          { title: 'Avoid afternoon energy dips', desc: 'Stand up, stretch, or take a short walk. Change your environment to reset your focus.' },
        ],
      },
      {
        id: 'social',
        title: 'Social Connections',
        emoji: '👥',
        content: 'Ramadan is a time for community and togetherness. Nurture your relationships during this blessed month.',
        items: [
          { title: 'Host or attend Iftar gatherings', desc: 'Sharing a meal strengthens bonds. Even a simple Iftar with friends is meaningful.' },
          { title: 'Reconnect with loved ones', desc: 'Use Ramadan as a reason to call family members or old friends you haven\'t spoken to in a while.' },
          { title: 'Resolve conflicts', desc: 'The blessed month is the perfect time to forgive, apologize, and mend broken relationships.' },
          { title: 'Support fasting colleagues', desc: 'If you have non-fasting colleagues, appreciate their consideration. Build bridges of understanding.' },
          { title: 'Join community activities', desc: 'Attend mosque events, charity drives, or Quran study circles. Community worship amplifies the Ramadan spirit.' },
        ],
      },
      {
        id: 'mindfulness',
        title: 'Mindfulness & Meditation',
        emoji: '🌸',
        content: 'Combining Islamic meditation practices with modern mindfulness can deepen your Ramadan experience.',
        items: [
          { title: 'Practice Dhikr (remembrance)', desc: 'Regular dhikr calms the mind and heart. SubhanAllah, Alhamdulillah, Allahu Akbar — repeat and reflect.' },
          { title: 'Eat mindfully at Iftar', desc: 'Don\'t rush your food. Eat slowly, taste each bite, and be present. This aids digestion and gratitude.' },
          { title: 'Morning Adhkar after Fajr', desc: 'The morning remembrances set a protective, peaceful tone for the entire day.' },
          { title: 'Reflect before sleep', desc: 'Spend 5 minutes reviewing your day. What went well? What can improve tomorrow? Thank Allah for the day.' },
          { title: 'Digital detox during worship', desc: 'Put your phone away during prayer, Quran reading, and family time. Be fully present in the moment.' },
        ],
      },
    ],
  },
]
