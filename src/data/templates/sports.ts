import { G, SAMPLE, badge, defineTemplate, footer, heading, logo, photo, shape, text } from './builders';

const P = G.portrait;

export const competitionResult = defineTemplate({
  id: 'sports-result',
  name: 'Competition Result',
  category: 'sports',
  description: 'Scoreboard card for quizzes, debates and sports days — two sides with scores.',
  defaultRatio: '4:5',
  background: { type: 'linear', angle: 90, stops: [[0, '#0b1220'], [1, 'brand.primary']] },
  elements: [
    photo(P(0, 0, 1080, 720), {
      src: SAMPLE.conference,
      overlay: { type: 'linear', angle: 90, stops: [[0, 'rgba(0, 0, 0, 0.25)'], [0.5, 'rgba(0, 0, 0, 0.1)'], [1, '#0b1220']] },
    }),
    logo(P(48, 44, 100, 100), { variant: 'mark', tone: 'light' }, { aspect: 1 }),
    badge('badge', 'badge', P(700, 56, 332, 62), { text: 'Results', style: 'tag', fill: 'brand.accent', color: '#ffffff' }),
    heading(P(64, 560, 952, 210), { text: 'Inter-College Research Quiz 2026', highlights: [1, 2], color: '#ffffff', fontSize: 70, vAlign: 'bottom' }),
    shape('card', P(64, 800, 952, 260), { fill: 'rgba(255, 255, 255, 0.08)', radius: 26, stroke: 'rgba(255, 255, 255, 0.16)', strokeWidth: 2 }),
    text('team-a', 'name', P(100, 826, 380, 90), { text: 'Patan Campus', fontSize: 38, fontWeight: 600, color: '#ffffff', align: 'center', vAlign: 'middle' }, { name: 'Team A' }),
    text('team-b', 'subheading', P(600, 826, 380, 90), { text: 'Amrit Campus', fontSize: 38, fontWeight: 600, color: '#ffffff', align: 'center', vAlign: 'middle' }, { name: 'Team B' }),
    text('score-a', 'number', P(100, 910, 380, 130), { text: '86', fontFamily: 'brand.heading', fontSize: 110, fontWeight: 800, color: 'brand.accent', align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Score A' }),
    text('score-b', 'label', P(600, 910, 380, 130), { text: '79', fontFamily: 'brand.heading', fontSize: 110, fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', align: 'center', vAlign: 'middle', lineHeight: 1 }, { name: 'Score B' }),
    text('vs', 'decoration', P(480, 900, 120, 110), { text: 'VS', fontSize: 38, fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)', align: 'center', vAlign: 'middle' }, { editable: false, locked: true, name: 'VS' }),
    text('body', 'body', P(64, 1090, 952, 100), { text: 'Congratulations to every participant!', fontSize: 34, color: 'rgba(255, 255, 255, 0.86)', align: 'center', vAlign: 'middle' }),
    footer(P(64, 1250, 952, 60), { align: 'center', color: 'rgba(255, 255, 255, 0.7)' }),
  ],
});
