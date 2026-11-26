// Course map. Topic list follows the structure of the source workbook (topics only);
// all questions, stories and art in this site are original.
export const PARTS = [
  { id: 'A', title: 'Maths Abilities', blurb: 'Build number sense, calculation power, spatial sense, logical thinking and modelling.', color: '#0f9d94' },
  { id: 'B', title: 'Maths Methods', blurb: 'Learn powerful problem-solving strategies used in Singapore maths.', color: '#ff6b5b' },
];
export const UNITS = [
  { id: 1, part: 'A', title: 'Number Sense', icon: 'number', color: '#0f9d94',
    topics: [
      { id: 't01', n: 1, title: 'Decimals That Stop and Decimals That Go On' },
      { id: 't02', n: 2, title: 'Comparing Recurring Decimals' },
      { id: 't03', n: 3, title: 'Proper Fractions, Improper Fractions and Mixed Numbers' },
      { id: 't04', n: 4, title: 'Using Letters to Stand for Numbers' },
      { id: 'L1', n: 'Life', title: 'Maths in Life: Spread the Risk', feature: true },
    ] },
  { id: 2, part: 'A', title: 'Calculation Power', icon: 'calc', color: '#4aa8ff',
    topics: [
      { id: 't05', n: 5, title: 'Smart Multiplication with the Distributive Law' },
      { id: 't06', n: 6, title: 'Place Value Puzzles' },
    ] },
  { id: 3, part: 'A', title: 'Seeing Shapes', icon: 'geometry', color: '#7b61ff',
    topics: [
      { id: 't07', n: 7, title: 'Cutting Up Shapes' },
      { id: 't08', n: 8, title: 'Finding Angles Smartly' },
      { id: 'L2', n: 'Life', title: 'Maths in Life: Beautiful Tessellations', feature: true },
    ] },
  { id: 4, part: 'A', title: 'Logical Thinking', icon: 'logic', color: '#f2a516',
    topics: [
      { id: 't09', n: 9, title: 'Planning Time Wisely' },
      { id: 't10', n: 10, title: 'Choosing the Best Meeting Point' },
      { id: 't11', n: 11, title: 'Detective Logic Games' },
      { id: 't12', n: 12, title: 'Multiplication Digit Puzzles' },
      { id: 't13', n: 13, title: 'Division Digit Puzzles' },
      { id: 'S1', n: 'Story', title: 'Maths Story: Tian Ji\'s Horse Race', feature: true },
    ] },
  { id: 5, part: 'A', title: 'Maths Modelling', icon: 'model', color: '#ff6b5b',
    topics: [
      { id: 't14', n: 14, title: 'Boats Going Upstream and Downstream' },
      { id: 't15', n: 15, title: 'Trains Crossing Bridges' },
    ] },
  { id: 6, part: 'B', title: 'Draw a Model', icon: 'bar', color: '#0f9d94',
    topics: [
      { id: 't16', n: 16, title: 'Average' },
      { id: 't17', n: 17, title: 'Excess and Shortage' },
      { id: 't18', n: 18, title: 'Matching Quantities' },
      { id: 't19', n: 19, title: 'Number Patterns with a Common Difference' },
      { id: 'S2', n: 'Story', title: 'Maths Story: Han Xin Counts His Soldiers', feature: true },
    ] },
  { id: 7, part: 'B', title: 'Work Backwards', icon: 'back', color: '#4aa8ff',
    topics: [{ id: 't20', n: 20, title: 'Working Backwards with Many Quantities' }] },
  { id: 8, part: 'B', title: 'Make a Supposition', icon: 'suppose', color: '#7b61ff',
    topics: [
      { id: 't21', n: 21, title: 'Chickens and Rabbits' },
      { id: 't22', n: 22, title: 'Trying Out Specific Numbers' },
      { id: 'S3', n: 'Story', title: 'Maths Story: Descartes and the Grid', feature: true },
    ] },
  { id: 9, part: 'B', title: 'Addition Principle', icon: 'add', color: '#3dbb6b',
    topics: [{ id: 't23', n: 23, title: 'Page Number Problems' }] },
  { id: 10, part: 'B', title: 'Multiplication Principle', icon: 'mult', color: '#f2a516',
    topics: [{ id: 't24', n: 24, title: 'Lining Up with Special Conditions' }] },
  { id: 11, part: 'B', title: 'Overlapping Groups', icon: 'venn', color: '#ff6b5b',
    topics: [{ id: 't25', n: 25, title: 'Three-Circle Venn Problems' }] },
  { id: 12, part: 'B', title: 'Think About the Worst Case', icon: 'pigeon', color: '#0f9d94',
    topics: [{ id: 't26', n: 26, title: 'The Pigeonhole Principle' }] },
  { id: 13, part: 'B', title: 'Challenge Zone', icon: 'star', color: '#7b61ff',
    topics: [{ id: 'CZ', n: '★', title: 'Mixed Challenge Problems', feature: true }] },
];
