const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const dailyTips = [
  {
    tipNumber: 1,
    title: "Hydration is Key",
    shortTip: "Drink plenty of water between Iftar and Suhoor.",
    fullContent: "Dehydration is a common challenge during Ramadan. Make sure to drink at least 8 glasses of water between Iftar and Suhoor. Avoid sugary drinks and caffeine as they can dehydrate you further. Try adding lemon or cucumber to your water for a refreshing twist."
  },
  {
    tipNumber: 2,
    title: "Don't Skip Suhoor",
    shortTip: "Suhoor is the most important meal of the day.",
    fullContent: "Skipping Suhoor can lead to fatigue and low energy levels throughout the day. Opt for slow-digesting complex carbohydrates like oats, whole grains, and proteins like eggs or yogurt to keep you fuller for longer."
  },
  {
    tipNumber: 3,
    title: "Break Your Fast Gently",
    shortTip: "Start with dates and water.",
    fullContent: "Dates provide an immediate source of natural sugar to replenish your energy levels, while water rehydrates your body. Follow the Sunnah and give your stomach a few minutes to prepare before eating a full meal."
  },
  {
    tipNumber: 4,
    title: "Portion Control",
    shortTip: "Avoid overeating at Iftar.",
    fullContent: "It's tempting to eat a large meal after a long day of fasting, but overeating can cause indigestion and sluggishness. Eat slowly and listen to your body's signals. Use smaller plates to help manage portion sizes."
  },
  {
    tipNumber: 5,
    title: "Stay Active",
    shortTip: "Light exercise maintains energy levels.",
    fullContent: "You don't need to do intense workouts while fasting. A light walk before Iftar or a gentle yoga session can help maintain muscle mass and keep your metabolism active. Avoid high-intensity cardio during fasting hours."
  },
  {
    tipNumber: 6,
    title: "Limit Salt Intake",
    shortTip: "Salty foods increase thirst.",
    fullContent: "Avoid foods high in sodium like processed meats, pickles, and salty snacks during Suhoor, as they will make you thirsty during the day. Flavor your food with herbs and spices instead of excessive salt."
  },
  {
    tipNumber: 7,
    title: "Prioritize Sleep",
    shortTip: "Aim for quality sleep.",
    fullContent: "Ramadan schedules can disrupt sleep patterns. Try to get at least 4-6 hours of continuous sleep at night and take a short power nap in the afternoon if possible to recharge."
  },
  {
    tipNumber: 8,
    title: "Include Fiber",
    shortTip: "Fiber aids digestion.",
    fullContent: "Include fruits, vegetables, and whole grains in your meals. Fiber helps prevent constipation, a common issue during Ramadan due to changes in meal times and reduced water intake."
  },
  {
    tipNumber: 9,
    title: "Reduce Sugar",
    shortTip: "Limit traditional sweets.",
    fullContent: "While Ramadan sweets are delicious, they cause rapid spikes and crashes in blood sugar. Enjoy them in moderation or opt for fruit salads as a healthier alternative."
  },
  {
    tipNumber: 10,
    title: "Charity & Kindness",
    shortTip: "Focus on spiritual growth.",
    fullContent: "Ramadan is not just about abstaining from food; it's about feeding the soul. Engage in acts of charity, smile more, and practice patience with others."
  }
]

const articles = [
  {
    title: "Healthy Iftar Recipes",
    excerpt: "Nutritious and delicious recipes to break your fast.",
    category: "Nutrition",
    htmlContent: "<h1>Healthy Iftar Ideas</h1><p>Breaking your fast with nutritious food is essential. Here are some ideas:</p><ul><li><strong>Lentil Soup:</strong> High in protein and fiber.</li><li><strong>Grilled Chicken Salad:</strong> Light and packed with vitamins.</li><li><strong>Quinoa Bowl:</strong> A great source of complex carbs.</li></ul><p>Avoid deep-fried foods like samosas daily; try baking them instead!</p>",
    displayOrder: 1
  },
  {
    title: "Managing Caffeine Withdrawal",
    excerpt: "How to handle headaches and fatigue.",
    category: "Health",
    htmlContent: "<h1>Beat the Caffeine Headache</h1><p>If you're a coffee lover, the first few days of Ramadan can be tough. <strong>Tips to manage:</strong></p><ol><li>Gradually reduce intake before Ramadan (if possible).</li><li>Have a small cup at Iftar, not Suhoor, to avoid dehydration.</li><li>Stay well-hydrated with water.</li></ol>",
    displayOrder: 2
  },
  {
    title: "The Spiritual Benefits of Fasting",
    excerpt: "Connecting deeper with your faith.",
    category: "Spiritual",
    htmlContent: "<h1>A Time for Reflection</h1><p>Fasting is a shield and a means to attain Taqwa (God-consciousness). It teaches self-discipline, empathy for the less fortunate, and gratitude for the blessings we often take for granted. Use this month to disconnect from distractions and reconnect with the Quran.</p>",
    displayOrder: 3
  },
  {
    title: "Fitness Routine During Ramadan",
    excerpt: "When and how to work out.",
    category: "Fitness",
    htmlContent: "<h1>Best Times to Exercise</h1><p>Timing is everything when fasting.</p><ul><li><strong>Before Suhoor:</strong> Best for high intensity if you can wake up early.</li><li><strong>Before Iftar:</strong> Good for light cardio or resistance training, but stay hydrated.</li><li><strong>After Iftar (2-3 hours):</strong> The ideal time for most people to perform their regular workouts.</li></ul>",
    displayOrder: 4
  },
  {
    title: "Balancing Work and Worship",
    excerpt: "Productivity tips for the fasting employee.",
    category: "Lifestyle",
    htmlContent: "<h1>Productivity Tips</h1><p>Working while fasting requires planning.</p><ul><li>Prioritize high-focus tasks for the morning when your energy is highest.</li><li>Take breaks for prayer and short walks.</li><li>Communicate with your team about your schedule.</li><li>Use your lunch break for rest or reading Quran.</li></ul>",
    displayOrder: 5
  },
  {
    title: "Hydration Hacks",
    excerpt: "Creative ways to drink more water.",
    category: "Health",
    htmlContent: "<h1>Eat Your Water</h1><p>Did you know you can eat your water? Include water-rich foods in your diet:</p><ul><li>Watermelon (92% water)</li><li>Cucumber (95% water)</li><li>Strawberries (91% water)</li><li>Spinach (93% water)</li></ul><p>These help keep you hydrated alongside drinking regular water.</p>",
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
      console.log(`Tip #${tip.tipNumber} already exists`)
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
      console.log(`Article "${article.title}" already exists`)
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
