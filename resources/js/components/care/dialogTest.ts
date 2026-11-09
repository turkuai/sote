export const dummyCategories = [
  // Root categories
  { id: 1, name: 'Erittäminen', parent_category_id: null },
  { id: 2, name: 'Ravitsemus', parent_category_id: null },
  { id: 3, name: 'Liikkuminen', parent_category_id: null },
  { id: 4, name: 'Unihäiriö', parent_category_id: null },

  // Erittäminen → subcategories
  { id: 5, name: 'Ulostamiseen liittyvä häiriö', parent_category_id: 1 },
  { id: 6, name: 'Virtsaamiseen liittyvä häiriö', parent_category_id: 1 },

  // Ulostamiseen liittyvä häiriö → leaves
  { id: 7, name: 'Ummetus', parent_category_id: 5 },
  { id: 8, name: 'Ripuli', parent_category_id: 5 },

  // Virtsaamiseen liittyvä häiriö → leaves
  { id: 9, name: 'Virtsaumpi', parent_category_id: 6 },
  { id: 10, name: 'Virtsan pidätyskyvyttömyys', parent_category_id: 6 },

  // Ravitsemus → leaves
  { id: 11, name: 'Syömisvaikeus', parent_category_id: 2 },
  { id: 12, name: 'Heikentynyt ruokahalu', parent_category_id: 2 },

  // Liikkuminen → one branch and one leaf
  { id: 13, name: 'Kävelyvaikeus', parent_category_id: 3 },
  { id: 14, name: 'Vaikeus vaihtaa asentoa', parent_category_id: 3 },

  // Kävelyvaikeus → deeper branch
  { id: 15, name: 'Tasapainovaikeus', parent_category_id: 13 },

  // Tasapainovaikeus → leaves
  { id: 16, name: 'Epävakaus seistessä', parent_category_id: 15 },
  { id: 17, name: 'Epävakaus kääntyessä', parent_category_id: 15 },
];
