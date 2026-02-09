// Static wellness content organized by category: Physical, Spiritual, Mental

export interface WellnessTopic {
  id: string
  title: string
  icon: string
  content: string
  items?: { title: string; desc: string }[]
}

export interface WellnessCategory {
  id: string
  label: string
  icon: string
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
    icon: 'Activity',
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
        icon: 'Droplets',
        content: 'Staying hydrated is the foundation of a healthy Ramadan. Proper hydration prevents headaches, fatigue, and lack of focus during fasting hours.',
        items: [
          { title: 'The 2-4-2 Rule', desc: 'Break it down: 2 glasses at Iftar, 4 glasses slowly between Iftar and Suhoor, and 2 glasses at Suhoor. This ensures you reach 8 glasses without feeling bloated.' },
          { title: 'Electrolytes are key', desc: 'Water isn\'t enough. Eat foods rich in potassium like dates, bananas, and yogurt, or drink coconut water to replace lost electrolytes and prevent muscle cramps.' },
          { title: 'Avoid the "Suhoor Chug"', desc: 'Drinking huge amounts of water right before Fajr flushes out your system too quickly. Sip gradually throughout the night for better absorption.' },
          { title: 'Watch the caffeine', desc: 'Coffee and tea are diuretics (they make you lose water). If you must have caffeine, limit it to one cup 2 hours after Iftar and follow it with an extra glass of water.' },
          { title: 'Eat your water', desc: 'Include water-rich foods in your meals. Watermelon (92% water), cucumber (96% water), and tomatoes are excellent for "eating" your hydration.' },
        ],
      },
      {
        id: 'exercise',
        title: 'Exercise During Ramadan',
        icon: 'Dumbbell',
        content: 'You don\'t need to stop training, but you should adjust your intensity. The goal is maintenance, not hitting new personal records.',
        items: [
          { title: 'The "Golden Hour" Workout', desc: 'The best time to train is 1 hour before Iftar. You can push yourself knowing you will refuel immediately after. Focus on lower intensity cardio or weights.' },
          { title: 'Post-Taraweeh Sessions', desc: 'If you prefer high intensity, wait until after Taraweeh (2-3 hours after Iftar). Your body is fully fueled and hydrated by then.' },
          { title: 'Focus on mobility', desc: 'Fasting can make joints feel stiff. dedicate 15 minutes daily to stretching or yoga. It aids digestion and helps with Taraweeh standing.' },
          { title: 'Listen to your body signals', desc: 'If you feel dizzy, lightheaded, or nauseous, stop immediately. These are signs of dehydration or low blood sugar. Don\'t push through.' },
          { title: 'Active fasting', desc: 'Ideally, stay active during the day with light walking. It keeps your metabolism running and helps pass the time, but avoid heavy sweating.' },
        ],
      },
      {
        id: 'sleep',
        title: 'Sleep & Rest',
        icon: 'Moon',
        content: 'Sleep is often the first casualty of Ramadan. Quality rest is essential for hormonal balance, mood regulation, and spiritual focus.',
        items: [
          { title: 'The 90-Minute Cycle', desc: 'Sleep cycles are roughly 90 minutes. Try to sleep in multiples of 1.5 hours (e.g., 4.5 or 6 hours) to wake up feeling refreshed, not groggy.' },
          { title: 'The "Qailulah" (Power Nap)', desc: 'A 20-minute nap between Dhuhr and Asr is a prophetic tradition. It resets your energy for the rest of the fasting day without ruining night sleep.' },
          { title: 'Avoid heavy meals pre-sleep', desc: 'Eating a heavy, greasy meal right before bed forces your body to digest instead of rest, lowering sleep quality. Stop eating 2 hours before sleep.' },
          { title: 'Screen-free sanctuary', desc: 'Blue light suppresses melatonin. Put your phone away 30 minutes before bed. Read Quran or do Dhikr to relax your mind for deeper sleep.' },
          { title: 'Consistent wake-up times', desc: 'Try to wake up for Suhoor at the same time every day. Regularity helps your circadian rhythm adjust to the new Ramadan schedule.' },
        ],
      },
      {
        id: 'meals',
        title: '30 Egyptian Ramadan Meals',
        icon: 'UtensilsCrossed',
        content: 'A complete culinary journey through Egypt. From the festive first-day Fattah to the comfort of Koshari, discover a traditional dish for every Iftar.',
        items: [],
      },
    ],
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    icon: 'Sparkles',
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
        icon: 'Sun',
        content: 'Ramadan is the season of the soul. Deepening your connection through prayer transforms it from a routine into a spiritual lifeline.',
        items: [
          { title: 'The "Early Bird" Fajr', desc: 'Don\'t just wake up for food. Wake up 10 minutes early for 2 rakaat of Tahajjud. It\'s the most spiritually charged time of the day.' },
          { title: 'Sunnah consistency', desc: 'Focus on the 12 Sunnah Mu\'akkadah prayers daily. The Prophet (PBUH) promised a house in Jannah for those who preserve them.' },
          { title: 'Taraweeh at your pace', desc: 'If you can\'t go to the mosque, pray Taraweeh at home. Even 2 or 4 rakats with focus (Khushu) are heavier on the scale than 20 rushed ones.' },
          { title: 'The Dua list', desc: 'Prepare a written list of Duas for yourself, your family, and the Ummah. Read from it right before breaking your fast—the time when dua is never rejected.' },
          { title: 'Post-prayer pause', desc: 'Don\'t rush off after Salam. Stay seated for 2 minutes to do your Tasbih (SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x). It calms the heart.' },
        ],
      },
      {
        id: 'quran',
        title: 'Quran Connection',
        icon: 'BookOpen',
        content: 'This is the month of the Quran. It\'s not just about how much you read, but how much the Quran reads you and changes your heart.',
        items: [
          { title: 'The "One Juz" Strategy', desc: 'To finish the Quran, read 4 pages after every prayer. 4 pages x 5 prayers = 20 pages (1 Juz) daily. It makes the big goal manageable.' },
          { title: 'Tadabbur (Reflection) over speed', desc: 'If you fall behind, don\'t race just to finish. Reading one page with deep understanding and tears is better than ten pages with a wandering mind.' },
          { title: 'Audio companionship', desc: 'Listen to the Quran while commuting or cooking. It keeps your tongue moist with remembrance and protects your ears from idle talk.' },
          { title: 'The "Ayah of the Day"', desc: 'Pick one verse each morning, read its Tafseer (explanation), and try to embody its meaning throughout your day.' },
          { title: 'Share the light', desc: 'Start a family Quran circle. Even 10 minutes before Iftar where everyone reads a few verses creates angels\' presence in your home.' },
        ],
      },
      {
        id: 'charity',
        title: 'Charity & Giving',
        icon: 'HeartHandshake',
        content: 'Generosity in Ramadan should be like the wind—fast and far-reaching. It purifies your wealth and softens your heart.',
        items: [
          { title: 'Feed a fasting person', desc: 'Carry extra dates or water bottles in your car or bag. Giving someone their Iftar gets you the reward of their fast without diminishing theirs.' },
          { title: 'The "Auto-Sadaqah" Hack', desc: 'Set up a small daily automatic transfer to a charity for the 30 days. Even $1 a day guarantees you catch Laylatul Qadr\'s blessing.' },
          { title: 'Hidden charity', desc: 'Give something in secret where your left hand doesn\'t know what your right hand gave. It extinguishes the anger of the Lord and kills ego.' },
          { title: 'Zakat calculation', desc: 'Ramadan is the best time to pay Zakat on your savings/gold. Use a trusted calculator and pay it early to help families prepare for Eid.' },
          { title: 'Service is charity', desc: 'Help your family with Iftar prep or cleanup. Serving your parents or spouse is an act of charity often overlooked.' },
        ],
      },
      {
        id: 'patience',
        title: 'Patience (Sabr)',
        icon: 'Shield',
        content: 'Fasting is half of patience. It\'s a boot camp for controlling your impulses, tongue, and temper under pressure.',
        items: [
          { title: 'The "I Am Fasting" Shield', desc: 'When provoked or angry, verbally say "Inni Sa\'im" (I am fasting). It\'s a reminder to yourself and a de-escalation for others.' },
          { title: 'Gratitude Journaling', desc: 'Hunger reminds us of blessings. Write down 3 things you often take for granted (warm shower, eyesight, safety) daily before Iftar.' },
          { title: 'Digital Sabr', desc: 'Patience isn\'t just about food. Fast from doom-scrolling, arguments in comments sections, and negative news. Protect your peace.' },
          { title: 'Mindful chewing', desc: 'Practice patience with your food. Chew slowly. It improves digestion and makes you thankful for every bite after a long day.' },
          { title: 'Forgive and overlook', desc: 'Ramadan is the month of mercy. Text someone you have a grudge against and wish them a blessed Ramadan. Clear your heart.' },
        ],
      },
    ],
  },
  {
    id: 'mental',
    label: 'Mental',
    icon: 'Brain',
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
        icon: 'CloudSun',
        content: 'Your body is under physiological stress from fasting, and your schedule is flipped. Proactive stress management is key to preventing burnout.',
        items: [
          { title: 'The "Brain Dump" Method', desc: 'Anxiety often comes from trying to remember everything. Each night, write down every task for tomorrow. Clear your mind so you can sleep.' },
          { title: 'Say "No" gracefully', desc: 'Ramadan is not a social marathon. If you\'re exhausted, it\'s okay to decline a late-night Suhoor gathering. Protect your energy for worship.' },
          { title: 'The 4-7-8 Breathing', desc: 'When hunger makes you irritable: Inhale for 4 seconds, hold for 7, exhale for 8. It instantly switches your nervous system from "fight or flight" to "rest and digest".' },
          { title: 'Batch your Iftar prep', desc: 'Don\'t cook from scratch every day. Cook double portions. Use a slow cooker. Spending 4 hours in the kitchen daily is a recipe for stress, not spirituality.' },
          { title: 'Micro-breaks', desc: 'You don\'t need an hour. Take 5 minutes after Asr prayer to just sit in silence, no phone, no talking. It resets your mental state before the busy Iftar rush.' },
        ],
      },
      {
        id: 'focus',
        title: 'Peak Productivity',
        icon: 'Target',
        content: 'Fasting can actually sharpen your focus if you work with your body\'s new rhythm instead of fighting against it.',
        items: [
          { title: 'The "Morning Sprint"', desc: 'Your brain is sharpest and most fueled right after Suhoor/Fajr. Schedule your most difficult cognitive tasks for the first 3 hours of the workday.' },
          { title: 'The Pomodoro Adaptation', desc: 'Your focus span might be shorter. Work for 25 minutes, break for 5. It keeps you moving without burning out your glucose-deprived brain.' },
          { title: 'Strategic Communication', desc: 'Tell your team "I am fasting." Most people respect it. Try to schedule meetings in the morning when your energy is high, avoiding the pre-Iftar slump.' },
          { title: 'Declutter for clarity', desc: 'A messy desk creates a messy mind. Spend the first 5 minutes of work organizing your space. It gives you a sense of control and calm.' },
          { title: 'Movement is energy', desc: 'When the afternoon fog hits (usually 2-4 PM), don\'t just sit there. Stand up, stretch, or walk for 5 minutes. It wakes up your nervous system.' },
        ],
      },
      {
        id: 'social',
        title: 'Meaningful Connections',
        icon: 'Users',
        content: 'Ramadan is about community (Ummah). It\'s a chance to repair, strengthen, and deepen the bonds that matter most.',
        items: [
          { title: 'The "Iftar Host" Reward', desc: 'Hosting doesn\'t mean a 5-course banquet. Invite friends for simple dates, soup, and main dish. The baraka is in the gathering, not the extravagance.' },
          { title: 'Reconnect with a call', desc: 'Texting is easy; calling is caring. Call one relative or old friend each week just to check in. It bridges distances instantly.' },
          { title: 'The First Move', desc: 'Have a strained relationship? Be the one to say "Ramadan Kareem" first. The better person is the one who initiates the Salam.' },
          { title: 'Inclusivity', desc: 'Do you have non-Muslim colleagues or neighbors? Share some Iftar food with them. It\'s the most beautiful form of Dawah (invitation) and kindness.' },
          { title: 'Community Taraweeh', desc: 'Praying shoulder to shoulder with strangers reminds you that we are all equal. Don\'t isolate yourself; the community spirit is a healer.' },
        ],
      },
      {
        id: 'mindfulness',
        title: 'Mindfulness (Muraqaba)',
        icon: 'Flower2',
        content: 'Islamic spirituality is the original mindfulness. It\'s about being present with Allah and conscious of your actions in every moment.',
        items: [
          { title: 'Dhikr while doing', desc: 'Turn chores into worship. While cooking or driving, keep your tongue busy with "SubhanAllah". It transforms mundane tasks into mountains of good deeds.' },
          { title: 'The "First Bite" Awareness', desc: 'At Iftar, don\'t just inhale food. Look at the date. Smell it. Taste its sweetness. Feel the gratitude. This is mindful eating.' },
          { title: 'Morning Adhkar protection', desc: 'Start your day with the morning supplications. They are like a spiritual armor that protects your peace of mind throughout the day.' },
          { title: 'The Daily Review (Muhasaba)', desc: 'Before sleep, spend 3 minutes reflecting: What did I do well? What can I improve? Thank Allah for the wins, seek forgiveness for the slips.' },
          { title: 'Digital Detox Blocks', desc: 'Create "Sacred Zones": No phone at the dinner table. No phone on the prayer mat. Be fully present where you are.' },
        ],
      },
    ],
  },
]
