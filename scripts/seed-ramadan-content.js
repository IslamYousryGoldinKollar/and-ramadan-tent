const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const dailyTips = [
  {
    tipNumber: 1,
    title: "Hydration Strategy",
    shortTip: "Drink water in intervals, not all at once.",
    fullContent: "Don't chug a liter of water at Suhoor; it will just pass through quickly. Instead, sip water gradually throughout the night (approx. 2 cups at Iftar, 4 cups between meals, 2 cups at Suhoor) to maximize absorption and stay hydrated."
  },
  {
    tipNumber: 2,
    title: "The Power of Suhoor",
    shortTip: "There is blessing in the pre-dawn meal.",
    fullContent: "The Prophet (PBUH) said: 'Eat Suhoor, for in Suhoor there is blessing.' Even a few dates and water give you physical energy and spiritual barakah. Focus on complex carbs (oats, whole wheat) and protein (eggs, yogurt) for lasting energy."
  },
  {
    tipNumber: 3,
    title: "Break Fast Gently",
    shortTip: "Start with dates and water.",
    fullContent: "Your stomach has been resting all day. Shocking it with heavy, greasy food causes indigestion. Follow the Sunnah: break fast with 1-3 dates and water, pray Maghrib, then return for your main meal. This primes your digestion."
  },
  {
    tipNumber: 4,
    title: "The 20-Minute Rule",
    shortTip: "It takes 20 mins for your brain to realize you're full.",
    fullContent: "Eat slowly and mindfully. Chewing your food well aids digestion and prevents overeating. If you still feel hungry after one plate, wait 20 minutes before going for seconds—you likely won't need them."
  },
  {
    tipNumber: 5,
    title: "Active Fasting",
    shortTip: "Movement creates energy.",
    fullContent: "Fasting isn't an excuse to sleep all day. Light activity like walking or stretching actually boosts energy levels by improving circulation. The best time for a light workout is an hour before Iftar."
  },
  {
    tipNumber: 6,
    title: "Watch the Salt",
    shortTip: "Sodium is the enemy of thirst.",
    fullContent: "Avoid pickles, salty cheeses, and processed meats at Suhoor. Sodium draws water from your cells, making you incredibly thirsty the next day. Season with herbs, lemon, and spices instead."
  },
  {
    tipNumber: 7,
    title: "Sleep Cycles",
    shortTip: "Quality over quantity.",
    fullContent: "Ramadan nights are short. Try to sleep in 90-minute cycles (e.g., 4.5 or 6 hours) to wake up at the end of a cycle feeling refreshed. A 20-minute 'Qailulah' (power nap) in the afternoon can be a lifesaver."
  },
  {
    tipNumber: 8,
    title: "Fiber is Your Friend",
    shortTip: "Prevent sluggish digestion.",
    fullContent: "Changes in meal times often lead to constipation. Prioritize fiber-rich foods like vegetables, fruits with skin, legumes, and whole grains. They keep your digestive system moving and regulate blood sugar."
  },
  {
    tipNumber: 9,
    title: "Sugar Crash Awareness",
    shortTip: "Sweets taste good but drain energy.",
    fullContent: "Traditional Ramadan desserts are delicious but cause massive blood sugar spikes followed by crashes that leave you tired and hungry. Enjoy a small piece, but rely on fruit for your main sugar fix."
  },
  {
    tipNumber: 10,
    title: "Charity of the Smile",
    shortTip: "Kindness is a form of Sadaqah.",
    fullContent: "Hunger can make us irritable ('hangry'). Remember that controlling your temper is part of the fast. A smile or a kind word to a colleague or family member is a rewarded charity."
  },
  {
    tipNumber: 11,
    title: "Caffeine Management",
    shortTip: "Avoid the withdrawal headache.",
    fullContent: "If you're a coffee drinker, avoid having it at Suhoor as it dehydrates you. Have your cup 2 hours after Iftar. This prevents dehydration while satisfying the craving without disrupting sleep too much."
  },
  {
    tipNumber: 12,
    title: "The Golden Hour",
    shortTip: "Dua before Iftar is never rejected.",
    fullContent: "The last hour before Maghrib is often spent frantically in the kitchen or stuck in traffic. reclaim this time. Even 5 minutes of heartfelt Dua before breaking your fast is one of the most powerful spiritual opportunities of the day."
  },
  {
    tipNumber: 13,
    title: "Social or Spiritual?",
    shortTip: "Balance gatherings with worship.",
    fullContent: "Ramadan gatherings are beautiful, but don't let them consume every night. Balance social Iftars with nights dedicated to Taraweeh, Quran, and family bonding at home."
  },
  {
    tipNumber: 14,
    title: "The Miswak Habit",
    shortTip: "Oral hygiene is a Sunnah.",
    fullContent: "Using a Miswak (or brushing teeth) is highly recommended, even while fasting. It cleanses the mouth and pleases the Lord. It helps combat 'fasting breath' and maintains oral health."
  },
  {
    tipNumber: 15,
    title: "Quran Connection",
    shortTip: "Read with understanding.",
    fullContent: "Ramadan is the month of the Quran. Don't just race to finish reading the pages. Reading one page with reflection (Tadabbur) and understanding is better than reading ten pages with a wandering mind."
  },
  {
    tipNumber: 16,
    title: "Digital Detox",
    shortTip: "Fast from the phone too.",
    fullContent: "We fast from food, but feast on social media. Try a 'Digital Fast' during the hour of Iftar or during Taraweeh time. Being present in the moment enhances gratitude and spiritual focus."
  },
  {
    tipNumber: 17,
    title: "Practice Gratitude",
    shortTip: "Hunger teaches appreciation.",
    fullContent: "When you feel the pang of hunger, let it be a reminder of those who are hungry not by choice. Let your first sip of water at Maghrib be a moment of deep, conscious gratitude to Allah."
  },
  {
    tipNumber: 18,
    title: "The Art of Forgiveness",
    shortTip: "Clear your heart.",
    fullContent: "Ramadan is the month of mercy. Is there a grudge you're holding? A family member you haven't spoken to? Be the better person and reach out. Forgive others so that Allah may forgive you."
  },
  {
    tipNumber: 19,
    title: "Anger Management",
    shortTip: "Say 'I am Fasting'.",
    fullContent: "The Prophet (PBUH) taught us: if someone provokes you, say 'Inni Sa'im' (I am fasting). Use this phrase as a shield to protect your fast from the damage of anger and arguments."
  },
  {
    tipNumber: 20,
    title: "Family Ties",
    shortTip: "Iftar is for connection.",
    fullContent: "Put phones away during the Iftar meal. Use this time to connect with your family, share stories, and discuss what you're grateful for. These moments build memories that last longer than the food."
  },
  {
    tipNumber: 21,
    title: "Sunnah Prayers",
    shortTip: "Build your house in Jannah.",
    fullContent: "Focus on the 12 Sunnah Mu'akkadah prayers (2 before Fajr, 4+2 Zuhr, 2 Maghrib, 2 Isha). They cover the shortcomings of obligatory prayers and carry immense reward in this blessed month."
  },
  {
    tipNumber: 22,
    title: "Seek Laylatul Qadr",
    shortTip: "Better than 1000 months.",
    fullContent: "In the last ten nights, increase your worship. Treat every night as if it is Laylatul Qadr. A small charity, a short prayer, or a sincere repentance on this night is worth a lifetime of worship."
  },
  {
    tipNumber: 23,
    title: "Zakat al-Fitr",
    shortTip: "Purify your fast.",
    fullContent: "Don't delay Zakat al-Fitr until the Eid prayer. Pay it a few days early to ensure it reaches the needy in time for them to buy food and clothing for Eid joy."
  },
  {
    tipNumber: 24,
    title: "Zero Waste Iftar",
    shortTip: "Respect the blessing of food.",
    fullContent: "We often cook with our eyes, not our stomachs. Plan portions carefully to avoid food waste. Save leftovers for Suhoor or give them to someone in need. Waste contradicts the spirit of Ramadan."
  },
  {
    tipNumber: 25,
    title: "Mindful Eating",
    shortTip: "Taste your food.",
    fullContent: "Eating mindfully improves digestion and satisfaction. Put your fork down between bites. Focus on the flavors and textures. You'll enjoy the meal more and naturally eat less."
  },
  {
    tipNumber: 26,
    title: "Delay Suhoor",
    shortTip: "There is wisdom in waiting.",
    fullContent: "It is Sunnah to delay Suhoor until close to Fajr time. This reduces the total fasting hours and gives you energy closer to the start of the day. It's also a blessed time for Istighfar (seeking forgiveness)."
  },
  {
    tipNumber: 27,
    title: "Hasten Iftar",
    shortTip: "Don't delay breaking fast.",
    fullContent: "The Prophet (PBUH) encouraged hastening to break the fast as soon as the sun sets. It shows eagerness to obey Allah and kindness to the body. Keep dates and water ready beforehand."
  },
  {
    tipNumber: 28,
    title: "Dua for Others",
    shortTip: "Angels say 'Ameen, and to you'.",
    fullContent: "Make a list of people to pray for—friends, family, the sick, the oppressed. When you make dua for others in their absence, the angels pray for the same for you."
  },
  {
    tipNumber: 29,
    title: "Consistency Key",
    shortTip: "Small but consistent.",
    fullContent: "The most beloved deeds to Allah are those that are consistent, even if small. Don't burn out. A consistent 2 rakaat of night prayer is better than one long night followed by abandonment."
  },
  {
    tipNumber: 30,
    title: "Eid Preparation",
    shortTip: "End strong.",
    fullContent: "As Ramadan ends, prepare for Eid with Takbeer and gratitude, not just shopping. Ensure your heart is ready to carry the light of Ramadan into the rest of the year. Finish strong!"
  }
]

const articles = [
  {
    title: "The Ultimate Guide to Healthy Iftar",
    excerpt: "Break your fast the right way to sustain energy and avoid the post-Iftar crash.",
    category: "Nutrition",
    htmlContent: `
      <h1>How to Build the Perfect Iftar Plate</h1>
      <p>After 14+ hours of fasting, your body is craving fuel. But dumping a heavy, greasy meal into an empty stomach is a recipe for disaster (and a food coma). Here is the science-backed strategy for a healthy Iftar:</p>
      
      <h2>1. The Warm-Up: Dates & Water</h2>
      <p>Prophetic wisdom meets modern biology. Dates give you a quick sugar spike to wake up your pancreas, while water rehydrates your cells. Wait 10-15 minutes (pray Maghrib) before eating the main meal. This "gap" tells your stomach, "Get ready, food is coming."</p>

      <h2>2. The Foundation: Soup</h2>
      <p>Warm soup comforts the stomach and replenishes fluids. Lentil, vegetable, or chicken broth are excellent choices. Avoid heavy cream-based soups every day.</p>

      <h2>3. The Rule of Thirds</h2>
      <p>Divide your main plate into three sections:</p>
      <ul>
        <li><strong>1/2 Vegetables:</strong> Salad, steamed veggies, or cooked greens. Fiber prevents constipation and fills you up.</li>
        <li><strong>1/4 Protein:</strong> Grilled chicken, fish, lean beef, or beans. Protein prevents muscle loss.</li>
        <li><strong>1/4 Complex Carbs:</strong> Brown rice, sweet potato, or whole wheat bread. Avoid white carbs that spike insulin.</li>
      </ul>

      <h2>4. The Danger Zone: Fried Foods</h2>
      <p>Samosas and spring rolls are staples, but they are calorie bombs. Try baking them or using an air fryer. If you must fry, limit it to one piece, not five.</p>
    `,
    displayOrder: 1
  },
  {
    title: "Caffeine Withdrawal Survival Kit",
    excerpt: "Headaches? Irritability? Here is how to manage your coffee addiction during Ramadan.",
    category: "Health",
    htmlContent: `
      <h1>Surviving Without Your Morning Cup</h1>
      <p>For many, the hardest part of fasting isn't food or water—it's the lack of caffeine. The "caffeine headache" usually hits on Day 1 or 2. Here is how to beat it.</p>

      <h2>The Strategy</h2>
      <ol>
        <li><strong>Don't Cold Turkey:</strong> If Ramadan hasn't started yet, cut down gradually. If it has, read on.</li>
        <li><strong>The 2-Hour Rule:</strong> Do NOT drink coffee at Iftar. It dehydrates you and messes with nutrient absorption. Wait 2 hours after Iftar.</li>
        <li><strong>Avoid Suhoor Coffee:</strong> It acts as a diuretic, making you lose water faster during the day. It also increases thirst.</li>
        <li><strong>Hydrate Hard:</strong> Most "caffeine headaches" are actually dehydration headaches disguised. Drink extra water.</li>
        <li><strong>Power Naps:</strong> A 20-minute nap can replace the alertness boost of one cup of coffee.</li>
      </ol>

      <p><em>Pro Tip: Switch to green tea. It has less caffeine and L-theanine, which gives a calm focus instead of jittery energy.</em></p>
    `,
    displayOrder: 2
  },
  {
    title: "Spiritual Detox: Reconnecting with Purpose",
    excerpt: "Ramadan is not just a diet. It is a boot camp for the soul. Here is how to maximize the spiritual benefits.",
    category: "Spiritual",
    htmlContent: `
      <h1>More Than Just Hunger</h1>
      <p>Imam Al-Ghazali described three levels of fasting:</p>
      <ul>
        <li><strong>Level 1: The Fast of the Stomach.</strong> Abstaining from food, drink, and intimacy. This is the bare minimum.</li>
        <li><strong>Level 2: The Fast of the Senses.</strong> Restraining the eyes from forbidden sights, the tongue from gossip/lying, and the ears from harmful talk.</li>
        <li><strong>Level 3: The Fast of the Heart.</strong> Emptying the heart of worldly cares and filling it only with the remembrance of Allah.</li>
      </ul>

      <h2>Practical Steps to Level Up</h2>
      <ul>
        <li><strong>Digital Detox:</strong> Unfollow accounts that make you envious or distracted. Replace scrolling with Dhikr.</li>
        <li><strong>The "Tongue Guard":</strong> Before you speak, ask: Is it true? Is it necessary? Is it kind? If not, silence is worship.</li>
        <li><strong>Charity in Secret:</strong> Give a small amount daily where no one sees you. It extinguishes the ego.</li>
      </ul>
    `,
    displayOrder: 3
  },
  {
    title: "Fitness While Fasting: Do's and Don'ts",
    excerpt: "You don't have to lose your gains. Here is how to train safely and effectively.",
    category: "Fitness",
    htmlContent: `
      <h1>Training Smart, Not Hard</h1>
      <p>Common Myth: "I shouldn't exercise while fasting."<br>
      Reality: Inactivity leads to muscle loss and lethargy. Movement keeps your metabolism alive.</p>

      <h2>The Best Times to Train</h2>
      <ul>
        <li><strong>Option A: The "Pre-Iftar" (Golden Hour).</strong> Train 1 hour before Maghrib.
          <ul>
            <li><em>Pros:</em> You eat immediately after. Fat burning is maximized.</li>
            <li><em>Cons:</em> Dehydration risk. Keep intensity low to moderate.</li>
          </ul>
        </li>
        <li><strong>Option B: The "Post-Taraweeh" (Power Hour).</strong> Train 2-3 hours after Iftar.
          <ul>
            <li><em>Pros:</em> Body is fueled and hydrated. You can lift heavy or do HIIT.</li>
            <li><em>Cons:</em> Might disrupt sleep if too late.</li>
          </ul>
        </li>
      </ul>

      <h2>What to Avoid</h2>
      <p>Avoid HIIT or heavy 1-rep max lifts while fasting. You risk injury, dizziness, and severe dehydration. Focus on maintenance, mobility, and steady-state cardio.</p>
    `,
    displayOrder: 4
  },
  {
    title: "Productivity Hacks for the Fasting Professional",
    excerpt: "How to crush your work goals without coffee or lunch breaks.",
    category: "Lifestyle",
    htmlContent: `
      <h1>Work Smarter, Not Harder</h1>
      <p>Fasting actually improves mental clarity (after the first few days) by stabilizing blood sugar. Use this to your advantage.</p>

      <h2>The Ramadan Work Schedule</h2>
      <ul>
        <li><strong>The "Morning Sprint":</strong> Your brain is most fueled right after Suhoor. Tackle your hardest, most complex task first thing in the morning (8 AM - 11 AM).</li>
        <li><strong>The "Midday Slump":</strong> Between 1 PM - 3 PM, energy dips. Schedule meetings, emails, or admin tasks here. Do not try to do deep work.</li>
        <li><strong>The "Micro-Break":</strong> Instead of a coffee break, take a "Wudu Break." washing your face with cool water wakes you up instantly.</li>
        <li><strong>The "Power Nap":</strong> If you work from home, a 15-minute nap at lunch time is more effective than caffeine.</li>
      </ul>

      <p><strong>Communication is Key:</strong> Tell your team you are fasting. Most colleagues will respect your need to skip lunch meetings or leave a bit earlier.</p>
    `,
    displayOrder: 5
  },
  {
    title: "Hydration Hacks: Eat Your Water",
    excerpt: "Struggling to drink 8 glasses? Here are delicious ways to stay hydrated.",
    category: "Health",
    htmlContent: `
      <h1>Beyond the Water Bottle</h1>
      <p>Drinking water is essential, but you can also "eat" your hydration. These foods act as a slow-release water source for your body.</p>

      <h2>Top Hydrating Foods</h2>
      <ul>
        <li><strong>Watermelon (92% Water):</strong> The ultimate Iftar fruit. It also contains lycopene and antioxidants.</li>
        <li><strong>Cucumber (95% Water):</strong> Add it to every salad or snack on it with hummus.</li>
        <li><strong>Yogurt (85% Water):</strong> Greek yogurt at Suhoor provides protein AND hydration.</li>
        <li><strong>Strawberries (91% Water):</strong> Great for dessert without the heavy sugar crash.</li>
      </ul>

      <h2>The Electrolyte Secret</h2>
      <p>Water alone isn't enough if you're sweating. You need electrolytes (sodium, potassium, magnesium). Coconut water is nature's sports drink. Dates provide potassium. A pinch of pink salt in your water helps absorption.</p>
    `,
    displayOrder: 6
  }
]

async function main() {
  console.log('Start seeding Ramadan content...')

  // Seed Daily Tips
  console.log('Seeding Daily Tips...')
  // Clear existing tips (optional, careful in prod)
  // await prisma.dailyTip.deleteMany() 
  
  for (const tip of dailyTips) {
    const existing = await prisma.dailyTip.findFirst({
      where: { tipNumber: tip.tipNumber }
    })

    if (!existing) {
      await prisma.dailyTip.create({
        data: tip
      })
      console.log(`Created tip #${tip.tipNumber}`)
    } else {
      await prisma.dailyTip.update({
        where: { id: existing.id },
        data: {
          title: tip.title,
          shortTip: tip.shortTip,
          fullContent: tip.fullContent
        }
      })
      console.log(`Updated tip #${tip.tipNumber}`)
    }
  }

  // Seed Articles
  console.log('Seeding Ramadan Articles...')
  // await prisma.ramadanArticle.deleteMany()

  for (const article of articles) {
    const existing = await prisma.ramadanArticle.findFirst({
      where: { title: article.title }
    })

    if (!existing) {
      await prisma.ramadanArticle.create({
        data: article
      })
      console.log(`Created article: ${article.title}`)
    } else {
      await prisma.ramadanArticle.update({
        where: { id: existing.id },
        data: {
          excerpt: article.excerpt,
          htmlContent: article.htmlContent,
          category: article.category,
          displayOrder: article.displayOrder
        }
      })
      console.log(`Updated article: ${article.title}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
