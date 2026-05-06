function getRange(n) {
  if (n <= 10) return 'r1';
  if (n <= 20) return 'r2';
  if (n <= 30) return 'r3';
  if (n <= 40) return 'r4';
  return 'r5';
}

function generateBalancedLotto() {
  while (true) {
    const pool = Array.from({ length: 45 }, (_, i) => i + 1);
    const game = [];
    while (game.length < 6) {
      const idx = Math.floor(Math.random() * pool.length);
      game.push(pool.splice(idx, 1)[0]);
    }
    game.sort((a, b) => a - b);

    const total = game.reduce((s, n) => s + n, 0);
    if (total < 90 || total > 150) continue;

    const oddCount = game.filter(n => n % 2 !== 0).length;
    if (oddCount < 2 || oddCount > 4) continue;

    let consecutive = 0;
    for (let i = 0; i < game.length - 1; i++) {
      if (game[i + 1] === game[i] + 1) consecutive++;
    }
    if (consecutive > 1) continue;

    const rangeCounts = [0, 0, 0, 0, 0];
    for (const n of game) {
      if (n <= 10) rangeCounts[0]++;
      else if (n <= 20) rangeCounts[1]++;
      else if (n <= 30) rangeCounts[2]++;
      else if (n <= 40) rangeCounts[3]++;
      else rangeCounts[4]++;
    }
    if (rangeCounts.some(c => c >= 3)) continue;

    return { numbers: game, total, oddCount };
  }
}

function generateFiveSets() {
  const sets = [];
  while (sets.length < 5) {
    const candidate = generateBalancedLotto();
    const isDupe = sets.some(s =>
      s.numbers.every((n, i) => n === candidate.numbers[i])
    );
    if (!isDupe) sets.push(candidate);
  }
  return sets;
}

function renderBall(n) {
  const div = document.createElement('div');
  div.className = `ball ${getRange(n)}`;
  div.textContent = n;
  return div;
}

function renderSets(sets) {
  const container = document.getElementById('sets');
  container.innerHTML = '';
  sets.forEach((set, idx) => {
    const card = document.createElement('div');
    card.className = 'set-card';

    const label = document.createElement('div');
    label.className = 'set-label';
    label.textContent = `게임 ${idx + 1}`;

    const balls = document.createElement('div');
    balls.className = 'balls';
    set.numbers.forEach(n => balls.appendChild(renderBall(n)));

    const meta = document.createElement('div');
    meta.className = 'set-meta';
    const even = 6 - set.oddCount;
    meta.innerHTML = `<span>합계 <strong>${set.total}</strong></span><span>홀수 ${set.oddCount} / 짝수 ${even}</span>`;

    card.append(label, balls, meta);
    container.appendChild(card);
  });
}

function generate() {
  const results = document.getElementById('results');
  results.classList.add('hidden');
  setTimeout(() => {
    const sets = generateFiveSets();
    renderSets(sets);
    results.classList.remove('hidden');
  }, 50);
}

document.getElementById('generateBtn').addEventListener('click', generate);
document.getElementById('regenerateBtn').addEventListener('click', generate);
