function toggleEvent(id, lang = 'en') {
  const suffix = lang === 'nl' ? '-nl' : '';
  const details = document.getElementById(id + '-details' + suffix);
  const card = details?.closest('.event-card');
  const allDetails = document.querySelectorAll('.event-card > div.mt-4');
  const allCards = document.querySelectorAll('.event-card');

  allDetails.forEach(el => el.classList.add('hidden'));
  allCards.forEach(c => c.classList.remove('active'));

  if (details && details.classList.contains('hidden')) {
    details.classList.remove('hidden');
    card.classList.add('active');
  }
}