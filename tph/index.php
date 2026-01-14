<?php
$base_url = 'https://www.davidenker.com/tph';
$img_url = "$base_url/assets/img/trm.jpg";

$lang = $_GET['lang'] ?? 'en';
$tab = $_GET['tab'] ?? 'overview';

$lang = in_array($lang, ['en', 'nl']) ? $lang : 'en';
$tabs = ['overview', 'events', 'mechanisms', 'symptoms', 'interventions', 'reframing'];
$tab = in_array($tab, $tabs) ? $tab : 'overview';

$dutch_tabs = [
  'overview' => 'overzicht',
  'events' => 'gebeurtenissen',
  'mechanisms' => 'mechanismen',
  'symptoms' => 'symptomen',
  'interventions' => 'interventies',
  'reframing' => 'herkadering'
];
$dutch_tab = $dutch_tabs[$tab];

$content_file = "content/$lang/" . ($lang === 'nl' ? $dutch_tab : $tab) . ".md";
$content = file_exists($content_file) ? file_get_contents($content_file) : "Content missing.";

function md($text) {
  $text = preg_replace('/^### (.*$)/m', '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>', $text);
  $text = preg_replace('/^## (.*$)/m', '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>', $text);
  $text = preg_replace('/^# (.*$)/m', '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>', $text);
  $text = preg_replace('/\*\*(.*?)\*\*/', '<strong class="font-bold">$1</strong>', $text);
  $text = preg_replace('/\*(.*?)\*/', '<em class="italic">$1</em>', $text);
  $text = preg_replace('/^- (.*$)/m', '<li class="ml-6">$1</li>', $text);
  $text = '<p class="mb-4 leading-relaxed">' . preg_replace('/\n\n/', '</p><p class="mb-4 leading-relaxed">', $text) . '</p>';
  $text = str_replace('<p><li>', '<ul class="list-disc mb-4 ml-6">', $text);
  $text = str_replace('</li></p>', '</li></ul>', $text);
  return $text;
}
$content_html = md($content);

$note = $lang === 'en' ?
  "<p class='text-sm text-gray-600 italic mt-8 border-t pt-4'><strong>Note:</strong> This model synthesizes research from trauma neuroscience, epigenetics, psychoneuroimmunology, and attachment theory. It's designed to help you see the <strong>SPECIFIC</strong> connections in your case, not generic trauma treatment.</p>" :
  "<p class='text-sm text-gray-600 italic mt-8 border-t pt-4'><strong>Opmerking:</strong> Dit model synthetiseert onderzoek uit traumaneurowetenschap, epigenetica, psychoneuro-immunologie en hechtingstheorie. Het is ontworpen om de <strong>SPECIFIEKE</strong> verbanden in jouw geval te helpen zien, niet algemene traumabehandeling.</p>";
?>

<!DOCTYPE html>
<html lang="<?= $lang ?>" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trauma & Healing – <?= ucfirst($lang === 'nl' ? $dutch_tab : $tab) ?></title>
  <meta property="og:title" content="Trauma & Healing">
  <meta property="og:description" content="A scientific framework for adoption, trauma and Parkinson's">
  <meta property="og:image" content="<?= $img_url ?>">
  <meta property="og:url" content="<?= "$base_url/" . ($lang==='nl' ? "nl/$dutch_tab" : $tab) ?>">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>brain</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { darkMode: 'class', theme: { extend: { colors: { 'primary-blue': '#1e40af', 'accent-purple': '#7c3aed' } } } }
  </script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">

<div class="fixed top-4 right-4 z-50">
  <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
    <i class="fas fa-moon dark:hidden"></i>
    <i class="fas fa-sun hidden dark:inline"></i>
  </button>
</div>

<header class="hero-gradient text-white py-4">
  <div class="max-w-6xl mx-auto px-4 flex justify-between items-center">
    <div class="flex items-center gap-3 cursor-pointer" onclick="location.href='?tab=overview&lang=<?= $lang ?>'">
      <i class="fas fa-brain text-4xl"></i>
      <div>
        <h1 class="text-xl font-bold"><?= $lang === 'en' ? 'Trauma, Parkinson\'s & Healing' : 'Trauma, Parkinson & Genezing' ?></h1>
        <p class="text-xs opacity-90">A scientific and personal framework</p>
      </div>
    </div>
    <div class="flex gap-1">
      <!-- FIXED: Buttons now keep current tab -->
      <a href="?tab=<?= $tab ?>&lang=en" class="w-8 py-1 text-xs font-semibold rounded-full <?= $lang==='en'?'bg-blue-600 text-white':'bg-white text-gray-700 border border-gray-300' ?> text-center">EN</a>
      <a href="?tab=<?= $dutch_tab ?>&lang=nl" class="w-8 py-1 text-xs font-semibold rounded-full <?= $lang==='nl'?'bg-blue-600 text-white':'bg-white text-gray-700 border border-gray-300' ?> text-center">NL</a>
    </div>
  </div>
</header>

<nav class="max-w-6xl mx-auto p-4 sticky top-0 bg-gray-50 dark:bg-gray-900 z-40 shadow-md">
  <div class="flex flex-wrap gap-2">
    <?php
    $nav_items = [
      'en' => ['overview'=>'Overview', 'events'=>'Events', 'mechanisms'=>'Mechanisms', 'symptoms'=>'Symptoms', 'interventions'=>'Interventions', 'reframing'=>'Reframing'],
      'nl' => ['overzicht'=>'Overzicht', 'gebeurtenissen'=>'Gebeurtenissen', 'mechanismen'=>'Mechanismen', 'symptomen'=>'Symptomen', 'interventies'=>'Interventies', 'herkadering'=>'Herkadering']
    ];
    $items = $nav_items[$lang];
    foreach ($items as $key => $label):
      $active = ($lang === 'nl' ? $dutch_tab : $tab) === $key;
      $icon = match($key) {
        'overview','overzicht' => 'fa-home',
        'events','gebeurtenissen' => 'fa-calendar',
        'mechanisms','mechanismen' => 'fa-cogs',
        'symptoms','symptomen' => 'fa-exclamation-triangle',
        'interventions','interventies' => 'fa-tools',
        'reframing','herkadering' => 'fa-lightbulb',
      };
    ?>
      <a href="?tab=<?= $key ?>&lang=<?= $lang ?>" 
         class="<?= $active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' ?> px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all">
        <i class="fas <?= $icon ?> text-sm"></i> <?= $label ?>
      </a>
    <?php endforeach; ?>
  </div>
</nav>

<main class="max-w-6xl mx-auto p-6">
  <article class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-10 wave-bg prose prose-lg max-w-none">
    <?= $content_html ?>
    <?= $note ?>
  </article>
  <div class="text-center mt-8">
    <button onclick="window.print()" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-full font-semibold hover:bg-blue-700 transition">
      <i class="fas fa-print"></i> Print this page
    </button>
  </div>
</main>

<footer class="max-w-6xl mx-auto p-6 text-center text-sm text-gray-600 dark:text-gray-400">
  <p>© 2025 David Enker – <a href="https://www.davidenker.com" class="underline">davidenker.com</a></p>
</footer>

<script src="assets/js/main.js"></script>
</body>
</html>