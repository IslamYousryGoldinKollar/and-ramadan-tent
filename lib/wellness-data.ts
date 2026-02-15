// Static wellness content organized by category: Physical, Mental, Emotional

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
  {
    day: 1,
    name: 'Fattah with Beef & Green Salad',
    nameAr: 'فتة باللحمة وسلطة خضراء',
    desc: `🥩 Protein: Slow-cooked beef chunks | 🍚 Carb: White rice & toasted baladi bread | 🥗 Fiber: Green salad with lemon dressing

FATTAH (فتة):
• Cut 500g beef into chunks, boil with 1 onion, 2 cardamom pods, salt & pepper until tender (about 1.5 hours). Reserve the broth.
• Toast 2 rounds of baladi bread in the oven until golden and crispy, then break into pieces and place at the bottom of a deep tray.
• Cook 2 cups Egyptian rice in the beef broth. Layer the rice over the toasted bread.
• For the sauce: Crush 6 garlic cloves, fry in 2 tbsp ghee until golden. Add 3 tbsp white vinegar, 2 cups beef broth, and 1 tbsp tomato paste. Boil for 5 minutes.
• Layer the beef on top of the rice. Pour the hot vinegar-garlic sauce over everything. Garnish with toasted pine nuts.

GREEN SALAD (سلطة خضراء):
• Chop 2 cucumbers, 3 tomatoes, 1 green pepper, half a lettuce head, and fresh parsley.
• Dress with lemon juice, olive oil, salt, and a pinch of cumin.
• Serve fresh alongside the fattah to balance the richness.`
  },
  {
    day: 2,
    name: 'Molokhia with Chicken & Rice',
    nameAr: 'ملوخية بالفراخ والرز',
    desc: `🍗 Protein: Roasted whole chicken | 🍚 Carb: White Egyptian rice | 🥗 Fiber: Molokhia leaves (jute mallow) + tomato salad

MOLOKHIA (ملوخية):
• Boil a whole chicken (about 1.2kg) with 1 onion, 2 bay leaves, salt, pepper, and cardamom. Once cooked, remove chicken and roast in oven at 200°C for 20 min until golden.
• Take 500g frozen or fresh chopped molokhia leaves. Bring 4 cups of the chicken broth to a boil, add the molokhia, and stir well.
• Prepare the "ta'leya": Crush 8 garlic cloves and fry in 3 tbsp ghee with 1 tbsp ground coriander until fragrant and golden. Add to the molokhia pot and stir. Let it simmer for 5 minutes. Do not cover the pot.
• The molokhia should be silky and slightly thick, not watery.

EGYPTIAN RICE (رز):
• Wash 2 cups rice, soak for 30 min. Fry 1 tbsp vermicelli noodles in 1 tbsp ghee until golden. Add rice, stir, then add 3 cups chicken broth. Cook on low until fluffy.

TOMATO SALAD (سلطة بلدي):
• Dice 4 tomatoes, 1 onion, and fresh parsley. Season with lemon juice, olive oil, salt, and cumin. Serve as a fresh side.`
  },
  {
    day: 3,
    name: 'Mahshi with Chicken Pieces',
    nameAr: 'محشي وفراخ',
    desc: `🍗 Protein: Braised chicken thighs | 🍚 Carb: Stuffed vegetables (rice filling) | 🥗 Fiber: Vine leaves, zucchini, peppers & cabbage shells + yogurt salad

MAHSHI (محشي):
• Prepare the stuffing: Mix 2 cups short-grain rice (soaked 30 min) with 3 diced tomatoes, 1 diced onion, 1 bunch chopped parsley and dill, 2 tbsp tomato paste, salt, pepper, cumin, and 2 tbsp oil.
• Hollow out 6 zucchini and 4 green peppers. Core a small cabbage and separate leaves, blanch until pliable. Prepare vine leaves by blanching briefly.
• Stuff each vegetable tightly with the rice mixture. Roll vine leaves and cabbage leaves into small cigars.
• Arrange in a large pot, alternating types. Place chicken thighs seasoned with salt, pepper, and cumin on top.
• Mix 2 cups tomato juice with 1 cup water, pour over the pot. Place a plate on top to weigh everything down.
• Cook on medium heat for 45-60 minutes until rice is cooked and vegetables are tender.

YOGURT CUCUMBER SALAD (سلطة زبادي):
• Mix 2 cups yogurt with 1 diced cucumber, 1 minced garlic clove, dried mint, salt, and a drizzle of olive oil. Serve cold as a refreshing side.`
  },
  {
    day: 4,
    name: 'Koshari with Grilled Chicken & Green Salad',
    nameAr: 'كشري وفراخ مشوية وسلطة خضراء',
    desc: `🍗 Protein: Grilled chicken breast + lentils & chickpeas (in koshari) | 🍚 Carb: Rice, macaroni & vermicelli | 🥗 Fiber: Green salad + crispy onions

KOSHARI (كشري):
• Cook 1 cup brown lentils in water until just tender (about 20 min). Drain and set aside.
• Cook 1 cup elbow macaroni until al dente. Drain and set aside.
• In a large pot, fry 1 tbsp vermicelli in 2 tbsp oil until golden. Add 2 cups rice and the cooked lentils, add 3.5 cups water, salt. Cook until fluffy.
• Soak 1 can chickpeas, drain and warm through.
• TOMATO SAUCE: Blend 4 tomatoes. Fry 1 diced onion in oil, add blended tomatoes, 2 tbsp vinegar, 1 tsp cumin, chili flakes, salt. Simmer 15 min until thick.
• DAKKA (hot sauce): Crush 4 garlic cloves with 1 tbsp vinegar, lemon juice, and chili. Mix well.
• CRISPY ONIONS: Slice 3 large onions into rings, fry in oil until deep golden and crunchy. Drain on paper towels.
• Layer in a bowl: rice-lentil mix, macaroni, chickpeas, tomato sauce, dakka, topped with crispy onions.

GRILLED CHICKEN: Marinate 2 chicken breasts in olive oil, lemon, garlic, cumin, paprika, salt. Grill or pan-sear for 6-7 min per side. Slice and serve alongside.

GREEN SALAD: Lettuce, cucumber, tomato, radish, and fresh mint with lemon-olive oil dressing.`
  },
  {
    day: 5,
    name: 'Bamia with Beef & White Rice',
    nameAr: 'بامية باللحمة والرز الأبيض',
    desc: `🥩 Protein: Beef cubes | 🍚 Carb: White Egyptian rice | 🥗 Fiber: Okra (bamia) in tomato sauce + green salad

BAMIA (بامية):
• Cut 500g beef into cubes. Brown in 2 tbsp ghee in a deep pot. Add 1 diced onion, cook until soft.
• Add 2 tbsp tomato paste, 2 diced tomatoes, salt, pepper, and enough water to cover the meat. Simmer for 1 hour until meat is nearly tender.
• Wash 500g fresh or frozen okra. If fresh, trim the tops carefully without piercing the pod (to avoid sliminess).
• Prepare the "ta'leya": Fry 4 crushed garlic cloves with 1 tbsp ground coriander in ghee until golden. Add to the stew.
• Add okra to the pot with the meat. Add a squeeze of lemon juice (reduces sliminess). Cook for 20-25 min until okra is tender but holds its shape.
• Adjust seasoning — the sauce should be rich and slightly tangy.

EGYPTIAN RICE: Cook 2 cups rice with vermicelli in beef broth for extra flavor.

GREEN SALAD: Dice cucumber, tomato, green pepper, and red onion. Dress with lemon, olive oil, salt, and fresh dill. Serve alongside the bamia and rice for a balanced plate.`
  },
  {
    day: 6,
    name: 'Chicken Pané & Pasta Arrabiata & Green Salad',
    nameAr: 'بانيه فراخ ومكرونة بالصلصة وسلطة خضراء',
    desc: `🍗 Protein: Crispy chicken pané (breaded chicken) | 🍝 Carb: Penne pasta with red sauce | 🥗 Fiber: Fresh green salad

CHICKEN PANÉ (بانيه فراخ):
• Take 4 chicken breasts, butterfly and pound to even thickness (about 1cm).
• Season with salt, pepper, garlic powder, and a squeeze of lemon.
• Set up breading station: flour → beaten eggs (with a splash of milk) → breadcrumbs (mixed with a pinch of paprika and dried oregano).
• Coat each piece: flour first, then egg, then breadcrumbs. Press firmly. For extra crunch, double-dip in egg and breadcrumbs.
• Deep fry in hot oil (180°C) for 3-4 minutes per side until deep golden and cooked through. Drain on paper towels.
• Alternatively, bake at 200°C for 20-25 min, flipping halfway, for a lighter version.

PENNE ARRABIATA (مكرونة بالصلصة):
• Cook 400g penne pasta until al dente. Drain.
• In a pan, sauté 4 minced garlic cloves in 3 tbsp olive oil. Add 1 can crushed tomatoes, 1 tbsp tomato paste, salt, black pepper, dried basil, and chili flakes to taste.
• Simmer the sauce for 15 min until thick. Toss with the cooked penne.

GREEN SALAD (سلطة خضراء):
• Chop romaine lettuce, cucumber, tomatoes, green pepper, carrots (shredded), and fresh parsley.
• Dress with lemon juice, olive oil, a pinch of salt, and dried mint. Toss well and serve fresh.`
  },
  {
    day: 7,
    name: 'Sayadeya (Fish & Rice) & Tahini Salad',
    nameAr: 'صيادية سمك وسلطة طحينة',
    desc: `🐟 Protein: Fried or grilled fish fillets | 🍚 Carb: Golden onion-infused rice | 🥗 Fiber: Tahini salad with parsley + green salad

SAYADEYA (صيادية):
• FISH: Take 4 sea bass or bolti fillets. Season with salt, pepper, cumin, and turmeric. Coat lightly in flour. Fry in oil until golden on both sides (3-4 min per side). Set aside.
• SAYADEYA RICE: Slice 4 large onions thinly. Fry slowly in 4 tbsp oil, stirring often, until deep caramelized brown (about 20 min). Remove half for garnish.
• Add 2 cups rice to the remaining onions, stir for 1 min. Add 1 tsp cumin, ½ tsp turmeric (for color), salt, and 3 cups fish stock or water. Cook until fluffy.
• TOMATO SAUCE: Blend 3 tomatoes with 2 garlic cloves. Cook in a pan with 1 tbsp oil, add cumin, salt, and a pinch of sugar. Simmer 10 min.
• Serve: Mound the yellow rice on a platter, arrange fish on top, pour sauce around, and garnish with crispy onions.

TAHINI SALAD (سلطة طحينة):
• Mix 4 tbsp tahini with juice of 2 lemons, 1 crushed garlic clove, salt, and water (add gradually) until smooth and creamy.
• Fold in chopped parsley and a drizzle of olive oil. Serve as a dip/side.

GREEN SALAD: Lettuce, cucumber, tomato, and radish with lemon dressing.`
  },
  {
    day: 8,
    name: 'Kofta with Tahini & Rice & Salad',
    nameAr: 'كفتة بالطحينة والرز وسلطة',
    desc: `🥩 Protein: Beef kofta baked in tahini sauce | 🍚 Carb: White rice + baked potatoes (in the tray) | 🥗 Fiber: Oriental salad

KOFTA WITH TAHINI (كفتة بالطحينة):
• Mix 500g ground beef with 1 grated onion, chopped parsley, salt, pepper, cumin, and 1 tsp allspice. Knead well.
• Shape into flat oval patties (about 8 pieces). Pan-sear in a little oil on both sides just to brown (2 min per side).
• Slice 3 potatoes into rounds (1cm thick). Arrange in a baking tray, place kofta patties on top.
• TAHINI SAUCE: Mix 1 cup tahini with juice of 3 lemons, 2 crushed garlic cloves, salt, and enough water to make a pourable sauce.
• Pour the tahini sauce over the kofta and potatoes until mostly covered.
• Add sliced tomatoes and green peppers on top for color.
• Bake at 180°C for 35-40 min until the tahini sauce is bubbly and golden on top and potatoes are cooked through.

EGYPTIAN RICE: Cook 2 cups rice with vermicelli in broth. Serve alongside.

ORIENTAL SALAD (سلطة شرقي):
• Finely dice 3 tomatoes, 2 cucumbers, 1 green pepper, 1 small onion, and fresh parsley.
• Dress with lemon juice, 2 tbsp olive oil, salt, cumin, and a touch of vinegar. Mix well.`
  },
  {
    day: 9,
    name: 'Hawawshi & Lentil Soup & Mixed Salad',
    nameAr: 'حواوشي وشوربة عدس وسلطة',
    desc: `🥩 Protein: Spiced ground beef in bread | 🍞 Carb: Egyptian baladi bread (baked with the meat) | 🥗 Fiber: Lentil soup + mixed green salad

HAWAWSHI (حواوشي):
• Mix 500g ground beef with 1 finely diced onion, 1 diced green pepper, 1 diced tomato, chopped parsley, salt, pepper, cumin, paprika, and a pinch of chili flakes.
• Cut 4 rounds of baladi bread in half to create pockets. Stuff generously with the meat mixture.
• Brush the outside of each bread with a little oil or melted butter.
• Bake at 200°C for 20-25 min until bread is crispy and golden and meat is cooked through. Flip halfway.
• For authentic flavor, press in a sandwich press or a heated pan with a weight on top for extra crispiness.

LENTIL SOUP (شوربة عدس):
• Wash 1.5 cups red lentils. In a pot, sauté 1 diced onion, 2 diced carrots, and 2 diced tomatoes in 1 tbsp ghee.
• Add lentils, 6 cups water, 1 tsp cumin, salt, and pepper. Boil then simmer for 25 min until lentils are very soft.
• Blend until smooth. Adjust consistency with water. Season with lemon juice.
• Serve with croutons (diced baladi bread fried in ghee) and a lemon wedge. This is the classic Ramadan iftar starter.

MIXED SALAD: Chopped cucumber, tomato, lettuce, red onion, fresh mint, with lemon-olive oil dressing.`
  },
  {
    day: 10,
    name: 'Grilled Chicken & Roz Moammar & Coleslaw',
    nameAr: 'فراخ مشوية ورز معمر وكولسلو',
    desc: `🍗 Protein: Charcoal-style grilled chicken | 🍚 Carb: Roz Moammar (Egyptian baked creamy rice) | 🥗 Fiber: Coleslaw salad

GRILLED CHICKEN (فراخ مشوية):
• Marinate a whole chicken (cut into quarters) in: juice of 3 lemons, 4 crushed garlic cloves, 2 tbsp olive oil, 1 tbsp vinegar, salt, pepper, paprika, cumin, and 1 tsp turmeric. Marinate at least 2 hours (overnight is best).
• Grill on charcoal or bake at 220°C for 40-45 min, basting with marinade, until skin is crispy and golden and internal temp reaches 75°C.
• Squeeze fresh lemon on top before serving.

ROZ MOAMMAR (رز معمر):
• Boil 2 cups Egyptian rice in salted water until 70% cooked (about 10 min). Drain.
• Mix the par-cooked rice with 2 cups hot whole milk, 3 tbsp butter, salt, and pepper.
• Pour into a greased baking dish. Dot the top with extra butter.
• Bake at 180°C for 30-35 min until the top forms a golden crust and the inside is creamy.
• The rice should be creamy and rich, with a satisfying crunch on top.

COLESLAW (كولسلو):
• Shred half a white cabbage and 2 carrots. Add diced green pepper and corn kernels.
• Dressing: Mix 3 tbsp mayonnaise, 1 tbsp yogurt, 1 tbsp lemon juice, salt, pepper, and a pinch of sugar.
• Toss well and refrigerate for 30 min before serving for best flavor.`
  },
  {
    day: 11,
    name: 'Béchamel Pasta & Grilled Kofta & Salad',
    nameAr: 'مكرونة بشاميل وكفتة مشوية وسلطة',
    desc: `🥩 Protein: Spiced ground beef layer + grilled kofta skewers | 🍝 Carb: Penne pasta with béchamel sauce | 🥗 Fiber: Green salad with herbs

BÉCHAMEL PASTA (مكرونة بشاميل):
• Cook 500g penne pasta until al dente. Drain and toss with a little oil.
• MEAT LAYER: Brown 300g ground beef with 1 diced onion, salt, pepper, cumin, and allspice until cooked through. Drain excess fat.
• BÉCHAMEL SAUCE: Melt 4 tbsp butter, whisk in 4 tbsp flour to make a roux. Gradually add 3 cups warm milk, whisking constantly. Add salt, pepper, and a pinch of nutmeg. Cook until thick and smooth.
• ASSEMBLE: Spread half the pasta in a greased 9x13 baking dish. Add the meat layer. Top with remaining pasta. Pour béchamel sauce over everything.
• Optional: Sprinkle grated mozzarella on top.
• Bake at 180°C for 25-30 min until golden and bubbly on top.

GRILLED KOFTA (كفتة مشوية):
• Mix 300g ground beef with grated onion, parsley, salt, pepper, cumin, and allspice. Shape onto skewers. Grill for 3-4 min per side.

GREEN HERB SALAD: Mix chopped lettuce, cucumber, tomato, fresh mint, dill, and parsley. Dress with lemon juice and olive oil.`
  },
  {
    day: 12,
    name: 'Dawoud Basha & White Rice & Fattoush',
    nameAr: 'داوود باشا والرز الأبيض وفتوش',
    desc: `🥩 Protein: Beef meatballs in tomato sauce | 🍚 Carb: White rice with vermicelli | 🥗 Fiber: Fattoush salad with toasted bread

DAWOUD BASHA (داوود باشا):
• Mix 500g ground beef with 1 grated onion, chopped parsley, salt, pepper, cumin, and allspice. Knead well.
• Shape into small meatballs (walnut-sized, about 20-24 pieces).
• Fry meatballs in oil until browned on all sides (don't fully cook). Remove and set aside.
• In the same pot, sauté 1 diced onion in 2 tbsp ghee until soft. Add 2 tbsp tomato paste, stir for 1 min.
• Add 3 diced tomatoes, 1 cup water, salt, pepper, allspice, and a pinch of cinnamon.
• Return meatballs to the sauce. Simmer on low heat for 25-30 min until meatballs are cooked through and sauce is rich and thick.
• Garnish with toasted pine nuts fried in a little ghee.

EGYPTIAN RICE: 2 cups rice with vermicelli, cooked in broth until fluffy.

FATTOUSH (فتوش):
• Toast or fry 1 round of pita bread cut into squares until crispy.
• Chop romaine lettuce, 2 tomatoes, 2 cucumbers, 1 green pepper, radishes, fresh mint, and parsley.
• Dressing: 3 tbsp olive oil, juice of 2 lemons, 1 tbsp pomegranate molasses, salt, and sumac.
• Toss salad with dressing and top with crispy bread pieces just before serving.`
  },
  {
    day: 13,
    name: 'Stuffed Pigeon & Freekeh & Green Salad',
    nameAr: 'حمام محشي بالفريكة وسلطة خضراء',
    desc: `🐦 Protein: Whole roasted stuffed pigeons | 🌾 Carb: Freekeh (smoked green wheat) stuffing | 🥗 Fiber: Green salad + onion-sumac garnish

STUFFED PIGEON (حمام محشي):
• Clean and wash 4 whole pigeons. Season inside and out with salt, pepper, and a little cardamom.
• FREEKEH STUFFING: Wash 1.5 cups coarse freekeh. Sauté 1 diced onion in 2 tbsp ghee, add the freekeh, stir for 2 min. Add 2 cups chicken broth, salt, pepper, cinnamon, and allspice. Cook for 15 min until freekeh is par-cooked but still has bite.
• Stuff each pigeon with the freekeh mixture. Tie the legs with kitchen string to keep stuffing in.
• Place pigeons in a deep pot. Add 1 cup water or broth, 1 tbsp ghee, and a cinnamon stick. Cover and cook on low for 1 hour.
• For crispy skin, transfer pigeons to a baking tray, brush with melted ghee, and broil for 10 min until golden.
• Cook remaining freekeh separately in pigeon broth until fully tender. Serve as a bed for the pigeons.

GREEN SALAD: Chopped lettuce, cucumber, tomato, and parsley with lemon-olive oil dressing. Garnish with sliced onion rings tossed in sumac.`
  },
  {
    day: 14,
    name: 'Kebab & Kofta Mashwi & Grilled Veggies & Bread',
    nameAr: 'كباب وكفتة مشوي وخضار مشوية وعيش',
    desc: `🥩 Protein: Lamb kebab cubes + beef kofta skewers | 🍞 Carb: Egyptian baladi bread + grilled potatoes | 🥗 Fiber: Grilled vegetables + tahini + oriental salad

KEBAB (كباب):
• Cut 500g lamb leg into 2cm cubes. Marinate in grated onion juice, olive oil, salt, pepper, cardamom, and a bay leaf for at least 2 hours.
• Thread onto metal skewers. Grill over charcoal (or under broiler) for 3-4 min per side for medium.

KOFTA MASHWI (كفتة مشوي):
• Mix 500g ground beef with 1 grated onion (squeeze out excess water), chopped parsley, salt, pepper, cumin, allspice, and a pinch of cinnamon.
• Shape onto flat metal skewers in elongated portions. Grill for 3-4 min per side.

GRILLED VEGETABLES (خضار مشوية):
• Halve tomatoes, peppers, and onions. Thread onto skewers or place directly on grill. Brush with olive oil, salt, and pepper. Grill until charred and tender.
• Grill thick potato slices (par-boiled) alongside until golden.

TAHINI DIP: Mix tahini, lemon juice, garlic, salt, and water until creamy.

ORIENTAL SALAD: Finely diced tomato, cucumber, onion, and parsley with lemon and olive oil. Serve everything with warm baladi bread.`
  },
  {
    day: 15,
    name: 'Molokhia with Rabbit & Rice & Salad',
    nameAr: 'ملوخية بالأرانب والرز وسلطة',
    desc: `🐇 Protein: Braised rabbit | 🍚 Carb: White rice with vermicelli | 🥗 Fiber: Molokhia (jute leaves) + tomato-onion salad

MOLOKHIA WITH RABBIT (ملوخية أرانب):
• Clean and cut 1 rabbit into pieces. Brown in ghee, then add 1 onion, salt, pepper, cardamom, and mastic grain. Cover with water and simmer for 1 hour until tender.
• Remove rabbit, strain and reserve the broth (should be about 4-5 cups).
• Take 500g fresh or frozen minced molokhia. Bring the rabbit broth to a rolling boil, add molokhia, and stir.
• TA'LEYA (the magic step): Crush 10 garlic cloves and fry in 3 tbsp ghee with 2 tbsp ground coriander until very fragrant and golden. Immediately pour into the molokhia pot — you should hear a dramatic sizzle.
• Stir well. The molokhia should NOT be covered after adding the ta'leya. Simmer for 5 min.
• Tip: Some families add a dried chili or a dash of lemon for extra depth.

The rabbit version is considered the premium, most flavorful molokhia in Egypt.

RICE: Cook with vermicelli in the remaining rabbit broth.

TOMATO-ONION SALAD: Sliced tomatoes, onion rings, and vinegar with a pinch of cumin and chili.`
  },
  {
    day: 16,
    name: 'Shawarma Chicken & Rice & Garlic Salad',
    nameAr: 'شاورما فراخ والرز وتومية وسلطة',
    desc: `🍗 Protein: Marinated chicken shawarma | 🍚 Carb: Basmati rice with nuts OR pita bread | 🥗 Fiber: Garlic sauce (toum) + pickled vegetables + green salad

CHICKEN SHAWARMA (شاورما فراخ):
• Slice 600g chicken thighs (boneless) into thin strips.
• MARINADE: Mix 3 tbsp yogurt, 2 tbsp olive oil, juice of 1 lemon, 2 tsp cumin, 1 tsp paprika, 1 tsp turmeric, ½ tsp cinnamon, ½ tsp allspice, ½ tsp cardamom, salt, pepper, and 3 minced garlic cloves. Marinate chicken for at least 3 hours (overnight is best).
• Heat a large skillet or griddle on high heat. Cook chicken strips in batches, don't overcrowd. Cook for 5-6 min until charred edges and fully cooked.
• Squeeze lemon over the cooked shawarma.

TOUM / GARLIC SAUCE (تومية):
• Blend 1 whole garlic head (peeled) with ¼ cup lemon juice, 1 cup sunflower oil (add slowly while blending), and salt. Should be thick, fluffy, and white.

RICE WITH NUTS: Cook 2 cups basmati rice. Garnish with toasted almonds and pine nuts fried in ghee.

PICKLED VEGETABLES (مخللات): Serve with pickled turnips, cucumbers, and hot peppers.

GREEN SALAD: Shredded cabbage, carrots, lettuce, and corn with a light yogurt dressing. Wrap in pita bread or serve plated.`
  },
  {
    day: 17,
    name: 'Fish Fillet & Sayadiya Rice & Coleslaw',
    nameAr: 'فيليه سمك ورز صيادية وكولسلو',
    desc: `🐟 Protein: Pan-fried seasoned fish fillet | 🍚 Carb: Sayadiya rice (caramelized onion rice) | 🥗 Fiber: Coleslaw + lemon wedges

PAN-FRIED FISH FILLET (فيليه سمك):
• Take 4 fish fillets (sea bass, tilapia, or sole). Pat dry.
• Season with salt, pepper, cumin, turmeric, paprika, and a squeeze of lemon.
• Dredge lightly in flour mixed with a pinch of cornstarch (for extra crunch).
• Pan-fry in hot oil for 3-4 min per side until golden and flaky. Don't move the fish until the crust sets.
• Drain on paper towels. Serve with lemon wedges.

SAYADIYA RICE (رز صيادية):
• Thinly slice 3 large onions. Slowly caramelize in 3 tbsp oil over medium-low heat for 20-25 min until deep brown.
• Add 2 cups washed rice, 1 tsp cumin, ½ tsp turmeric, salt, and 3.5 cups fish stock or water.
• Cook covered on low heat until rice is fluffy and golden. Each grain should be separate.

COLESLAW: Shred white and purple cabbage, carrots. Mix with mayonnaise, lemon, mustard, salt, and a pinch of sugar. Refrigerate before serving.

TAHINI DIP: Thin tahini with lemon juice and garlic for drizzling over the fish.`
  },
  {
    day: 18,
    name: 'Chicken Escalope & Penne Arrabiata & Rocket Salad',
    nameAr: 'اسكالوب فراخ ومكرونة أرابياتا وسلطة جرجير',
    desc: `🍗 Protein: Crispy chicken escalope | 🍝 Carb: Penne pasta with spicy tomato sauce | 🥗 Fiber: Fresh rocket (arugula) salad

CHICKEN ESCALOPE (اسكالوب فراخ):
• Butterfly 4 chicken breasts and pound thin (about 5mm). Season with salt, pepper, garlic powder, and lemon zest.
• Breading: Flour → egg wash → panko breadcrumbs mixed with dried parsley and dried oregano.
• Pan-fry in a mix of oil and butter for 3-4 min per side until golden and cooked through.
• The panko gives extra crunch compared to regular breadcrumbs. Serve with lemon wedges.

PENNE ARRABIATA (بيني أرابياتا):
• Cook 400g penne until al dente.
• Sauté 4 garlic cloves (sliced) in 3 tbsp olive oil with dried chili flakes. Add 1 can crushed San Marzano tomatoes, salt, sugar, and fresh basil.
• Simmer 15 min. Toss with pasta. Finish with a drizzle of olive oil.

ROCKET SALAD (سلطة جرجير):
• Wash and dry a large bunch of rocket (arugula). Add cherry tomatoes (halved), thinly sliced red onion, and crumbled white cheese (gibna beyda).
• Dress with olive oil, lemon juice, balsamic vinegar, salt, and pepper.
• The peppery rocket cuts through the richness of the escalope perfectly.`
  },
  {
    day: 19,
    name: 'Tagen Kofta & Potatoes & Rice & Salad',
    nameAr: 'طاجن كفتة بالبطاطس والرز وسلطة',
    desc: `🥩 Protein: Beef kofta in clay pot | 🍚 Carb: Potatoes (in tagen) + white rice | 🥗 Fiber: Tomato sauce (in tagen) + green salad

TAGEN KOFTA (طاجن كفتة):
• Mix 500g ground beef with 1 grated onion (squeezed dry), chopped parsley, salt, pepper, cumin, and allspice. Knead well for 5 min.
• Shape into elongated kofta fingers or flat patties.
• Slice 3 large potatoes into 1cm rounds. Slice 3 tomatoes and 2 green peppers.
• In a clay pot (tagen) or baking dish: Layer potato slices on the bottom, arrange kofta on top, then layer tomato and pepper slices.
• SAUCE: Mix 2 cups tomato passata with 2 crushed garlic cloves, 1 tbsp olive oil, salt, pepper, cumin, and a pinch of chili. Pour over everything.
• Cover with foil and bake at 180°C for 45 min. Remove foil and bake 15 more min until top is slightly charred.
• The clay pot gives an earthy, smoky flavor that's quintessentially Egyptian.

RICE: White rice with vermicelli, served alongside to soak up the rich tomato sauce.

GREEN SALAD: Cucumber, tomato, lettuce, and parsley with lemon-olive oil dressing.`
  },
  {
    day: 20,
    name: 'Grilled Sea Bass & Baked Potato & Tahini Salad',
    nameAr: 'قاروص مشوي وبطاطس بالفرن وسلطة طحينة',
    desc: `🐟 Protein: Whole grilled sea bass | 🥔 Carb: Baked potato with herbs | 🥗 Fiber: Tahini salad + mixed greens

GRILLED SEA BASS (قاروص مشوي):
• Score 2 whole sea bass (about 500g each) with diagonal cuts on both sides.
• MARINADE: Blend 4 garlic cloves, juice of 2 lemons, 2 tbsp olive oil, 1 tsp cumin, 1 tsp coriander, salt, pepper, and fresh dill.
• Rub marinade all over the fish, including inside the cavity. Stuff cavity with lemon slices and dill sprigs.
• Grill over charcoal for 7-8 min per side, or bake at 200°C for 25 min until flesh flakes easily.
• Serve with lemon wedges and a drizzle of olive oil.

BAKED POTATO (بطاطس بالفرن):
• Cut 4 potatoes into wedges. Toss with olive oil, garlic powder, paprika, dried rosemary, salt, and pepper.
• Spread on a baking sheet. Bake at 200°C for 30-35 min until golden and crispy, flipping halfway.

TAHINI SALAD: Tahini, lemon juice, garlic, parsley, and cumin thinned with water. Drizzle over fish and potatoes.

MIXED GREENS: Romaine lettuce, cucumber, cherry tomatoes, and radish with lemon dressing.`
  },
  {
    day: 21,
    name: 'Beef Stroganoff Egyptian Style & Rice & Salad',
    nameAr: 'ستروجانوف مصري والرز وسلطة',
    desc: `🥩 Protein: Beef strips in creamy mushroom sauce | 🍚 Carb: White basmati rice | 🥗 Fiber: Mushrooms & peppers (in sauce) + fresh garden salad

BEEF STROGANOFF (ستروجانوف):
• Cut 500g beef tenderloin or sirloin into thin strips. Season with salt, pepper, and paprika.
• Sear beef strips in 2 tbsp butter on very high heat in batches — 1-2 min per batch. Don't overcrowd. Remove and set aside.
• In the same pan, add 1 tbsp butter. Sauté 1 sliced onion, 200g sliced mushrooms, and 1 sliced green pepper until softened (5 min).
• Add 2 tbsp flour, stir for 1 min. Add 1 cup beef broth, stir until thick.
• Add 3 tbsp sour cream (or use yogurt for Egyptian twist), 1 tbsp mustard, salt, pepper, and a dash of soy sauce.
• Return beef to the pan. Simmer for 3-4 min. Don't overcook the beef.
• Garnish with fresh parsley.

RICE: Cook 2 cups basmati rice until fluffy. Fluff with a fork.

GARDEN SALAD: Chopped lettuce, cucumber, tomato, shredded carrots, corn, and red cabbage. Dress with olive oil, lemon, and dried herbs.`
  },
  {
    day: 22,
    name: 'Mombar & Mahshi & Rice & Salad',
    nameAr: 'ممبار ومحشي والرز وسلطة',
    desc: `🥩 Protein: Mombar (stuffed beef casing) | 🍚 Carb: Rice stuffing (in mahshi & mombar) | 🥗 Fiber: Stuffed vegetables + yogurt salad

MOMBAR (ممبار):
• Clean beef casings thoroughly (soak in vinegar and salt, rinse multiple times).
• FILLING: Mix 2 cups soaked short-grain rice with 2 diced tomatoes, 1 diced onion, chopped parsley and dill, 2 tbsp tomato paste, salt, pepper, cumin, coriander, and 2 tbsp oil.
• Stuff the casings with the rice mixture using a funnel — don't overfill (rice expands). Tie both ends.
• Boil mombar in salted water for 30-40 min until rice is cooked. Drain.
• Fry in hot oil until the casing is golden and crispy on all sides. Cut into rounds to serve.

MAHSHI KORONB (محشي كرنب - Stuffed Cabbage):
• Use the same rice filling. Blanch cabbage leaves until pliable. Place 1 tbsp filling on each leaf, roll tightly.
• Arrange rolls tightly in a pot, add tomato juice mixed with water. Place a plate on top. Cook for 40 min.

YOGURT SALAD: Mix yogurt with diced cucumber, garlic, dried mint, and salt. Serve cold to balance the richness of the mombar.`
  },
  {
    day: 23,
    name: 'Chicken Musakhan & Vermicelli Rice & Salad',
    nameAr: 'مسخن فراخ ورز بالشعيرية وسلطة',
    desc: `🍗 Protein: Roasted chicken with sumac & caramelized onions | 🍚 Carb: Vermicelli rice + taboon/pita bread | 🥗 Fiber: Caramelized onions + fresh salad

CHICKEN MUSAKHAN (مسخن فراخ):
• Season 4 chicken thighs (bone-in) with salt, pepper, 2 tbsp sumac, allspice, and olive oil. Set aside.
• Slice 5 large onions. Cook slowly in 4 tbsp olive oil with 2 tbsp sumac, 1 tsp allspice, salt, and pepper for 25-30 min until deeply caramelized and jammy.
• Place pita or taboon bread on a baking tray. Spread caramelized onions on the bread.
• Place chicken thighs on top. Drizzle with olive oil.
• Bake at 200°C for 35-40 min until chicken is golden and cooked through.
• Garnish with toasted pine nuts and more sumac.

VERMICELLI RICE: Fry vermicelli in ghee until golden, add rice and chicken broth. Cook until fluffy.

FRESH SALAD: Diced tomato, cucumber, red onion, and fresh parsley. Dress with lemon juice, olive oil, and a pinch of sumac.`
  },
  {
    day: 24,
    name: 'Fried Liver & Sausages & Rice & Salad',
    nameAr: 'كبدة وسجق والرز وسلطة',
    desc: `🥩 Protein: Alexandria-style fried liver + Egyptian beef sausage | 🍚 Carb: White rice with vermicelli + baladi bread | 🥗 Fiber: Green pepper & onion (in liver) + green salad

ALEXANDRIAN LIVER (كبدة اسكندراني):
• Cut 500g beef liver into small cubes (1.5cm). Remove any membranes.
• Heat 3 tbsp oil in a very hot pan (this is key — the pan must be smoking hot).
• Add liver cubes in a single layer. Don't stir for 2 min to get a crust.
• Add 1 sliced green pepper, 1 sliced onion, salt, pepper, cumin, chili, and garlic. Toss for 2-3 more min.
• The liver should be browned outside but still slightly pink inside. Don't overcook or it becomes rubbery.
• Finish with a squeeze of lemon.

EGYPTIAN SAUSAGE (سجق):
• Prick 400g Egyptian beef sausages (mumbar sausages) with a fork.
• Fry in a pan with a little oil until browned and cooked through (10-12 min). Slice into rounds.
• Alternatively, grill over charcoal for smoky flavor.

RICE: White rice with vermicelli, cooked in broth.

GREEN SALAD: Lettuce, tomato, cucumber, and arugula with lemon-olive oil dressing. Serve with warm baladi bread.`
  },
  {
    day: 25,
    name: 'Torly (Vegetable Casserole) & Grilled Chicken & Rice',
    nameAr: 'طرلي وفراخ مشوية والرز',
    desc: `🍗 Protein: Grilled chicken breast | 🍚 Carb: White rice | 🥗 Fiber: Torly — baked mixed vegetable casserole

TORLY (طرلي):
• Slice into rounds (1cm thick): 3 potatoes, 2 zucchini, 2 eggplants, 3 tomatoes, 2 onions, and 2 green peppers.
• Arrange in alternating layers in a deep baking dish, standing the slices upright if possible for presentation.
• SAUCE: Mix 1 cup tomato passata with 3 crushed garlic cloves, 2 tbsp olive oil, salt, pepper, cumin, dried oregano, and ½ cup water.
• Pour sauce over the vegetables, making sure it seeps between the layers.
• Cover with foil and bake at 180°C for 45 min. Remove foil and bake 15 more min until top is charred.
• The vegetables should be tender and the sauce thick and concentrated.

GRILLED CHICKEN: Marinate 4 chicken breasts in yogurt, garlic, lemon, paprika, cumin, salt, and pepper. Grill for 6-7 min per side until juicy and charred.

RICE: Cook 2 cups rice with vermicelli. The torly sauce is perfect for pouring over the rice.`
  },
  {
    day: 26,
    name: 'Freekeh with Chicken & Oriental Salad',
    nameAr: 'فريكة بالفراخ وسلطة شرقي',
    desc: `🍗 Protein: Braised chicken pieces | 🌾 Carb: Freekeh (smoked green wheat) | 🥗 Fiber: Freekeh fiber + oriental salad

FREEKEH WITH CHICKEN (فريكة بالفراخ):
• Season a whole chicken (cut into quarters) with salt, pepper, cumin, and turmeric. Brown in 2 tbsp ghee in a deep pot.
• Add 1 quartered onion, 2 cinnamon sticks, 3 cardamom pods, and enough water to cover. Simmer for 45 min until chicken is very tender. Remove chicken.
• FREEKEH: Wash 2 cups coarse freekeh (cracked green wheat). Soak for 15 min, drain.
• In a pot, sauté freekeh in 2 tbsp ghee for 2 min. Add 4 cups of the chicken broth, salt, pepper, cinnamon, and allspice.
• Cook covered on low for 25-30 min until freekeh is tender but still has a slight chew. The smoky flavor is the star here.
• Place chicken on top of the freekeh and broil together for 5 min to crisp the chicken skin.
• Garnish with toasted almonds and pine nuts.

Freekeh is higher in protein and fiber than rice — making this a naturally well-balanced meal.

ORIENTAL SALAD: Finely diced tomato, cucumber, onion, green pepper, and parsley with lemon, olive oil, and cumin.`
  },
  {
    day: 27,
    name: 'Rokak bil Lahma & Yogurt & Green Salad',
    nameAr: 'رقاق باللحمة وزبادي وسلطة خضراء',
    desc: `🥩 Protein: Spiced ground beef between pastry layers | 🍞 Carb: Rokak pastry sheets | 🥗 Fiber: Green salad + yogurt

ROKAK BIL LAHMA (رقاق باللحمة):
• MEAT FILLING: Brown 500g ground beef with 2 diced onions in 2 tbsp ghee. Add salt, pepper, cumin, allspice, and a pinch of cinnamon. Cook until meat is well done and crumbly. Add 1 cup beef broth and cook until liquid reduces by half.
• ROKAK SHEETS: If you can find fresh Egyptian rokak (paper-thin pastry sheets), great. Otherwise, use filo/phyllo pastry as substitute.
• Brush a baking tray with ghee. Layer 3-4 rokak sheets, brushing each with ghee.
• Spread the meat filling evenly. Top with 3-4 more rokak sheets, brushing each with ghee.
• Ladle some warm broth over the top layer to soften slightly.
• Bake at 180°C for 20-25 min until the top is golden and crispy.
• Cut into squares or diamonds to serve. The texture should be crispy on top, soft and meaty inside.

This is a beloved Ramadan-specific dish that many Egyptian families make only during the holy month.

YOGURT: Serve a bowl of plain cold yogurt alongside — it's the traditional pairing.

GREEN SALAD: Chopped lettuce, cucumber, tomato, mint, and dill with lemon dressing.`
  },
  {
    day: 28,
    name: 'Mixed Grill Plate & Rice & Grilled Vegetables',
    nameAr: 'مشويات مشكلة والرز وخضار مشوية',
    desc: `🥩 Protein: Lamb chops + chicken shish + kofta | 🍚 Carb: Basmati rice with nuts | 🥗 Fiber: Grilled vegetables + fresh salad + tahini

MIXED GRILL (مشويات مشكلة):
• LAMB CHOPS: Season 6 lamb chops with salt, pepper, rosemary, garlic, and olive oil. Grill 4-5 min per side for medium.
• CHICKEN SHISH: Cut 2 chicken breasts into cubes. Marinate in yogurt, lemon, garlic, cumin, and paprika for 2 hours. Thread onto skewers with onion and pepper. Grill 4 min per side.
• KOFTA: Mix 300g ground beef with grated onion, parsley, cumin, allspice, salt, and pepper. Shape onto skewers. Grill 3-4 min per side.
• Arrange all on a large platter for a grand presentation.

RICE WITH NUTS: Cook 2 cups basmati rice. Toast almonds, pine nuts, and cashews in ghee. Fold into rice with raisins.

GRILLED VEGETABLES: Grill halved tomatoes, peppers, onion wedges, and corn on the cob. Brush with olive oil and season.

TAHINI: Serve in a bowl for dipping. Fresh salad of lettuce, cucumber, and tomato on the side.`
  },
  {
    day: 29,
    name: 'Fatta with Chickpeas & Yogurt & Salad',
    nameAr: 'فتة حمص بالزبادي وسلطة',
    desc: `🥩 Protein: Chickpeas + yogurt | 🍞 Carb: Toasted pita bread + white rice | 🥗 Fiber: Chickpeas (high fiber) + green salad

FATTA WITH CHICKPEAS (فتة حمص):
• Soak 2 cups dried chickpeas overnight. Boil until very tender (about 1.5 hours), or use 2 cans drained chickpeas.
• Toast 3 rounds of pita bread in the oven until golden and crispy. Break into bite-sized pieces. Place in a deep serving tray.
• Cook 1 cup white rice. Layer over the bread.
• Spread warm chickpeas over the rice layer.
• YOGURT SAUCE: Mix 2 cups thick yogurt with 2 crushed garlic cloves, juice of 1 lemon, salt, and a pinch of cumin. Spread over the chickpeas.
• TOPPING: Fry 3 tbsp pine nuts in 2 tbsp ghee until golden. Pour the hot ghee and nuts over the yogurt layer.
• Sprinkle with paprika and dried mint for color and flavor.
• Serve immediately while the bread is still slightly crispy on the bottom.

GREEN SALAD: Romaine lettuce, cucumber, tomato, red onion, and radish with lemon-sumac dressing.

This lighter fatta variation is perfect for the last days of Ramadan when you want something satisfying but not heavy.`
  },
  {
    day: 30,
    name: 'Grand Fattah Feast & Mixed Salads',
    nameAr: 'فتة العيد الكبيرة وسلطات مشكلة',
    desc: `🥩 Protein: Premium slow-cooked beef shank | 🍚 Carb: White rice & toasted bread layers | 🥗 Fiber: Mixed salad platter (green, tahini, yogurt)

GRAND FATTAH FEAST (فتة العيد):
• Boil 1kg beef shank (bone-in for flavor) with 1 onion, cinnamon stick, bay leaves, cardamom, salt, and pepper for 2-2.5 hours until fall-off-the-bone tender. Reserve the rich broth.
• Toast 4 rounds of baladi bread in the oven until deep golden and crunchy. Break and layer at the bottom of your largest serving tray. Ladle some hot broth over to slightly soften.
• Cook 3 cups rice in the beef broth until perfectly fluffy. Layer over the bread.
• Shred or slice the beef and arrange beautifully on top of the rice.
• THE ULTIMATE SAUCE: Fry 8 crushed garlic cloves in 4 tbsp ghee until golden. Add 4 tbsp white vinegar and 2 cups beef broth. Boil for 5 min. Add 2 tbsp tomato paste for color. Season well.
• Pour the hot sauce generously over the entire tray.
• GARNISH: Toast pine nuts, almonds, and cashews in ghee. Scatter over the top. Add fresh parsley.

SALAD PLATTER (سلطات مشكلة):
• GREEN SALAD: Lettuce, cucumber, tomato, and herbs with lemon dressing.
• TAHINI SALAD: Tahini, lemon, garlic, and parsley.
• YOGURT SALAD: Yogurt with cucumber, mint, and garlic.

The perfect grand finale for Ramadan — a feast to share with family and loved ones! 🌙`
  },
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
          { title: 'Avoid the "Suhoor Chug"', desc: 'Drinking huge amounts of water right before dawn flushes out your system too quickly. Sip gradually throughout the night for better absorption.' },
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
          { title: 'Late Night Sessions', desc: 'If you prefer high intensity, wait until 2-3 hours after Iftar. Your body is fully fueled and hydrated by then.' },
          { title: 'Focus on mobility', desc: 'Fasting can make joints feel stiff. Dedicate 15 minutes daily to stretching or light mobility exercises. It aids digestion and helps with flexibility.' },
          { title: 'Listen to your body signals', desc: 'If you feel dizzy, lightheaded, or nauseous, stop immediately. These are signs of dehydration or low blood sugar. Don\'t push through.' },
          { title: 'Active fasting', desc: 'Ideally, stay active during the day with light walking. It keeps your metabolism running and helps pass the time, but avoid heavy sweating.' },
        ],
      },
      {
        id: 'sleep',
        title: 'Sleep & Rest',
        icon: 'Moon',
        content: 'Sleep is often the first casualty of Ramadan. Quality rest is essential for hormonal balance, mood regulation, and mental focus.',
        items: [
          { title: 'The 90-Minute Cycle', desc: 'Sleep cycles are roughly 90 minutes. Try to sleep in multiples of 1.5 hours (e.g., 4.5 or 6 hours) to wake up feeling refreshed, not groggy.' },
          { title: 'The Power Nap', desc: 'A 20-minute nap in the early afternoon resets your energy for the rest of the fasting day without ruining night sleep.' },
          { title: 'Avoid heavy meals pre-sleep', desc: 'Eating a heavy, greasy meal right before bed forces your body to digest instead of rest, lowering sleep quality. Stop eating 2 hours before sleep.' },
          { title: 'Screen-free sanctuary', desc: 'Blue light suppresses melatonin. Put your phone away 30 minutes before bed. Read a book to relax your mind for deeper sleep.' },
          { title: 'Consistent wake-up times', desc: 'Try to wake up for Suhoor at the same time every day. Regularity helps your circadian rhythm adjust to the new Ramadan schedule.' },
        ],
      },
      {
        id: 'meals',
        title: '30 Egyptian Ramadan Meals',
        icon: 'UtensilsCrossed',
        content: 'A complete 30-day meal plan with balanced Egyptian plates — each day features protein, carbs, and fiber/salad. Full recipes included, from the festive first-day Fattah to the grand finale feast.',
        items: [],
      },
    ],
  },
  {
    id: 'mental',
    label: 'Mental',
    icon: 'Brain',
    description: 'Focus, clarity & productivity',
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
          { title: 'Say "No" gracefully', desc: 'Ramadan is not a social marathon. If you\'re exhausted, it\'s okay to decline a late-night gathering. Protect your energy.' },
          { title: 'The 4-7-8 Breathing', desc: 'When hunger makes you irritable: Inhale for 4 seconds, hold for 7, exhale for 8. It instantly switches your nervous system from "fight or flight" to "rest and digest".' },
          { title: 'Batch your Iftar prep', desc: 'Don\'t cook from scratch every day. Cook double portions. Use a slow cooker. Spending 4 hours in the kitchen daily is a recipe for stress.' },
          { title: 'Micro-breaks', desc: 'You don\'t need an hour. Take 5 minutes in the afternoon to just sit in silence, no phone, no talking. It resets your mental state before the evening rush.' },
        ],
      },
      {
        id: 'focus',
        title: 'Peak Productivity',
        icon: 'Target',
        content: 'Fasting can actually sharpen your focus if you work with your body\'s new rhythm instead of fighting against it.',
        items: [
          { title: 'The "Morning Sprint"', desc: 'Your brain is sharpest and most fueled right after Suhoor. Schedule your most difficult cognitive tasks for the first 3 hours of the workday.' },
          { title: 'The Pomodoro Adaptation', desc: 'Your focus span might be shorter. Work for 25 minutes, break for 5. It keeps you moving without burning out your glucose-deprived brain.' },
          { title: 'Strategic Communication', desc: 'Tell your team "I am fasting." Most people respect it. Try to schedule meetings in the morning when your energy is high, avoiding the pre-Iftar slump.' },
          { title: 'Declutter for clarity', desc: 'A messy desk creates a messy mind. Spend the first 5 minutes of work organizing your space. It gives you a sense of control and calm.' },
          { title: 'Movement is energy', desc: 'When the afternoon fog hits (usually 2-4 PM), don\'t just sit there. Stand up, stretch, or walk for 5 minutes. It wakes up your nervous system.' },
        ],
      },
    ],
  },
  {
    id: 'emotional',
    label: 'Emotional',
    icon: 'HeartHandshake',
    description: 'Connection, balance & inner peace',
    gradient: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-200',
    bgLight: 'bg-pink-50',
    textColor: 'text-pink-700',
    iconBg: 'bg-pink-100',
    topics: [
      {
        id: 'social',
        title: 'Meaningful Connections',
        icon: 'Users',
        content: 'Ramadan is about community. It\'s a chance to repair, strengthen, and deepen the bonds that matter most.',
        items: [
          { title: 'The "Iftar Host" Reward', desc: 'Hosting doesn\'t mean a 5-course banquet. Invite friends for simple dates, soup, and main dish. The joy is in the gathering, not the extravagance.' },
          { title: 'Reconnect with a call', desc: 'Texting is easy; calling is caring. Call one relative or old friend each week just to check in. It bridges distances instantly.' },
          { title: 'The First Move', desc: 'Have a strained relationship? Be the one to reach out first. The better person is the one who initiates the connection.' },
          { title: 'Inclusivity', desc: 'Do you have colleagues or neighbors? Share some Iftar food with them. It\'s the most beautiful form of kindness.' },
          { title: 'Community Spirit', desc: 'Being around others reminds you that we are all equal. Don\'t isolate yourself; the community spirit is a healer.' },
        ],
      },
      {
        id: 'mindfulness',
        title: 'Mindfulness & Presence',
        icon: 'Flower2',
        content: 'Mindfulness is about being present in the moment and conscious of your actions.',
        items: [
          { title: 'Mindful Chores', desc: 'Turn chores into moments of calm. While cooking or driving, focus on your breathing or listen to something uplifting. It transforms mundane tasks.' },
          { title: 'The "First Bite" Awareness', desc: 'At Iftar, don\'t just inhale food. Look at the date. Smell it. Taste its sweetness. Feel the gratitude. This is mindful eating.' },
          { title: 'Morning Affirmations', desc: 'Start your day with positive intentions. They are like mental armor that protects your peace of mind throughout the day.' },
          { title: 'The Daily Review', desc: 'Before sleep, spend 3 minutes reflecting: What did I do well? What can I improve? Be grateful for the wins, and forgive yourself for the slips.' },
          { title: 'Digital Detox Blocks', desc: 'Create "Sacred Zones": No phone at the dinner table. No phone in the bedroom. Be fully present where you are.' },
        ],
      },
      {
        id: 'patience',
        title: 'Emotional Resilience',
        icon: 'Shield',
        content: 'Fasting is a training ground for patience. It\'s a boot camp for controlling your impulses, tongue, and temper under pressure.',
        items: [
          { title: 'The "Pause" Button', desc: 'When provoked or angry, take a deep breath before reacting. Remind yourself that you are fasting to de-escalate the situation.' },
          { title: 'Gratitude Journaling', desc: 'Hunger reminds us of blessings. Write down 3 things you often take for granted (warm shower, eyesight, safety) daily before Iftar.' },
          { title: 'Digital Patience', desc: 'Patience isn\'t just about food. Fast from doom-scrolling, arguments in comments sections, and negative news. Protect your peace.' },
          { title: 'Mindful chewing', desc: 'Practice patience with your food. Chew slowly. It improves digestion and makes you thankful for every bite after a long day.' },
          { title: 'Forgive and overlook', desc: 'Ramadan is a time for fresh starts. Text someone you have a grudge against and wish them well. Clear your heart.' },
        ],
      },
    ],
  },
]
