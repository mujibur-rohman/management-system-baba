const PRODUCT_DATA = [
  ['X-MOOD', 'X-MOOD', 'XX00'],
  ['BACARAT', 'TOP 501', 'BT01'],
  ['RUBI RAINER', 'RUBI RAINER', 'RR02'],
  ['MEVA', 'MEVA', 'MM03'],
  ['REXTASE', 'REXTASE', 'RR04'],
  ['B.OUTSIDE', 'B.OUTSIDE', 'BB05'],
  ['212 SEXY MAN', 'X MAN', '2X06'],
  ['212 SEXY WOMEN', 'X WOMEN', '2X07'],
  ['212 VIP MAN', 'V MAN', '2V08'],
  ['AGNES MONICA', 'HONEY MOON', 'AH09'],
  ['AIGNER BLACK', 'BLACK JACK', 'AB10'],
  ['AIGNER BLUE', 'BLUE ART', 'AB11'],
  ['AIGNER DEBUT', 'DEBUT', 'AD12'],
  ['ALPHARD', 'ALPHA ORI', 'AA13'],
  ['AMOR WOMAN', 'SUNMORI', 'AS14'],
  ['ANGEL HEART', 'HEART BOTTON', 'AH15'],
  ['ANNASUI DOLLY', 'DOLLY GIRL', 'AD16'],
  ['ANNASUI DREAM', 'SWEET DREAM', 'AS17'],
  ['ANNASUI FANCY', 'HANNA GLAMOUR', 'AH18'],
  ['ANNASUI ROSE', 'SWEET ROSE', 'AS19'],
  ['ANNASUI SECRET', 'HANNA CODE', 'AH20'],
  ['ANTONIO BANDERAS', 'BANDERAS', 'AB21'],
  ['AQUA DE GIO MAN', 'RBP GENTEL', 'AR22'],
  ['AQUA KISS', 'KISS ME', 'AK23'],
  ['AQUA MAN', 'ITS ME', 'AI24'],
  ['ARIANA GRANDE', 'ARANDE', 'AA25'],
  ['ARSENIK MAN', 'ARK MAN', 'AA26'],
  ['AVRIL LAVIGNE', 'AVNE', 'AA27'],
  ['AVRIL ROSE', '& ROSES', 'AR28'],
  ['AYU TING TING', 'ASK THINK', 'AA29'],
  ['BABA COFFE', 'BABA KAHVE', 'BB30'],
  ['BABA ROMANCE', 'BARONCE', 'BB31'],
  ['BARCELONA', 'BARBAR LONA', 'BB32'],
  ['BENETON PINK', 'BB PINK', 'BB33'],
  ['BLACK COFFE', 'COFFE STAR', 'BC34'],
  ['BLACK COMBAIN', 'BLACK IN', 'BB35'],
  ['BLACK MIX', 'BLACK MIX', 'BB36'],
  ['BRITNEY SPEARS', 'BS WOMEN', 'BB37'],
  ['BS JAPANESE CHERRY', 'JC BLOSSOM', 'BJ38'],
  ['BS WHITE MUSK', 'WHITE MUSK', 'BW39'],
  ['BUBBLE GUM', 'BUBBLE BE', 'BB40'],
  ['BULBERY LONDON', 'B LONDON', 'BB41'],
  ['BULGARI AQUA', 'BA MAN', 'BB342'],
  ['BULGARI EXTREAM', 'BA EXTREAM', 'BB43'],
  ['BULGARI JASMIN', 'BA JASMIN', 'BB44'],
  ['BULGARI OMNIA', 'BA OMNIA', 'BB45'],
  ['BULGARI ROSE', 'BA ROSE', 'BB46'],
  ['CH 212 MAN', 'CH 2 MAN', 'CC47'],
  ['CHANNEL COCO', 'COCO', 'CC48'],
  ['CK BEE', 'SWEET BEE', 'CS49'],
  ['COKLAT', 'COKLAT', 'CC50'],
  ['CRZ PLATINUM', 'CRZP', 'CC51'],
  ['CRISTIAN DIOR SAUVAGE', 'CRISDI SAUVAGE', 'CC52'],
  ['CRISTINA AGUILERA', 'CA WOME', 'CC53'],
  ['CROOKED MAN FRAGRANCE', 'CROOKED MAN', 'CC54'],
  ['CUDDLE BABY', 'BABY FACE', 'CB55'],
  ['D&G IMPERACTIVE', 'DETECTIVE', 'DD56'],
  ['D&G IMPERIAL', 'IMPERIAL', 'DI57'],
  ['D&G LIGHT BLUE MAN', 'LBLUE', 'DL58'],
  ['D&G MAN', 'LAKILUCK', 'DL59'],
  ['DIAMOR', 'MARIMAR', 'DM60'],
  ['DIAMOR WOMEN', 'SAKURA', 'DS61'],
  ['DUNHILL BLUE', 'BLUE SKY', 'DB62'],
  ['ESACADA MOON SPARKLE', 'EX MON', 'EE63'],
  ['ESCADA CHERRY', 'ESCARRY', 'EE64'],
  ['FERRARI BLACK', 'FERBLA', 'FF65'],
  ['FORSET', 'FROSS', 'FF66'],
  ['FULL MAN', 'FULL MAN', 'FF67'],
  ['GIORGIO ARMANI SI', 'GIOAR', 'GG68'],
  ['GREEN TEA', 'GREEN TEA', 'GG69'],
  ['GUCCI FLORA', 'G FLORA', 'GG70'],
  ['GUCCI GUILTY BLACK WOMAN', 'GG BLACK WOMEN', 'GG71'],
  ['GUCCI RUSH', 'G RUSH', 'GG72'],
  ['GUESS PINK', 'GS PINK', 'GG73'],
  ['HAPPY MAN', 'GOOD BOY', 'HG74'],
  ['HARAJUKU', 'TOP JAPAN', 'HT75'],
  ['HEART BUTTON', 'FALLING LOVE', 'HF76'],
  ['HERMES TERRE', 'HESTER', 'HH77'],
  ['HUGO BOsS ARMY', 'HB ARMY', 'HH78'],
  ['HUGO BOSS ENERGI', 'HB EGERGY', 'HH79'],
  ['HUGO BOSs ORANGE', 'HB ORANGE', 'HH80'],
  ['HUGO BOSS XX', 'HB XX', 'HH81'],
  ['ICE COOL', 'COLD MAN', 'IC82'],
  ['IMMAGINATION', 'IMMAGINATION', 'II83'],
  ['INCANTO SHINE', 'IN SHINE', 'II84'],
  ['INTERNITY MAN', 'INTER MAN', 'II85'],
  ['INTERNITY WOMEN', 'INTER MOWEN', 'II86'],
  ['ISSEY MIYAKE', 'ISSEY MI', 'II87'],
  ['JAGUAR BLACK', 'JG BLACK', 'JJ88'],
  ['JAGUAR BLUE', 'JG BLUE', 'JJ89'],
  ['JAGUAR VISION', 'JG VIXION', 'JJ90'],
  ['JAMES BOND', 'BOND 7', 'JB91'],
  ['JAPANESE CERRY', 'JP CERRY', 'JJ92'],
  ['JESIKA PARKER', 'J PARKER', 'JJ93'],
  ['JLO PLATINUM', 'JL PLATINUM', 'JJ94'],
  ['JLO STILL', 'JL STILL', 'JJ95'],
  ['JOE MALONE ENGISH PEAR', 'JM ENGLISH PEAR', 'JJ96'],
  ['KASTURI', 'KASTURI', 'KK97'],
  ['KATTY PERRY', 'SWEET LADY', 'KS98'],
  ['KISS & ROSE', 'KISS & ROSE', 'KK99'],
  ['KENZO BALI', 'ZO BAL', 'KZ100'],
  ['KENZO BATANG', 'ZO BATANG', 'KZ101'],
  ['KENZO DAUN', 'ZO DAUN', 'KZ102'],
  ['LACOSTE', 'LACOST', 'LL103'],
  ['LALISA PINK NABOBAN', 'MIKA PINK', 'LM104'],
  ['LIFEBOUY', 'LIFE BOY', 'LL105'],
  ['LION KING', 'BLUE KING', 'LB106'],
  ['LOVELY', 'LOVE ME', 'LL107'],
  ['LUX', 'LUX', 'LL108'],
  ['MAHER ZEIN', 'MAIN', 'MM109'],
  ['MALBORO', 'MALB', 'MM110'],
  ['MELON', 'MELON', 'MM111'],
  ['MOUNTBLANK', 'MONTE BIANCO', 'MM112'],
  ['NAGITA SLAVINA', 'AZZURA', 'NA113'],
  ['OLLA RAMLAN', 'WINTER', 'OW114'],
  ['ONE DIRECTION', 'ONE WAY', 'OO115'],
  ['PACO RABANI 1MILION', 'PC 1 MILION', 'PP116'],
  ['PACO RABANI INVICTUS', 'PC INV', 'PP117'],
  ['PARIS HILTON', 'EIFFEL', 'PE 118'],
  ['POLICE MAN', 'SAFETY MAN', 'PS119'],
  ['POLO SPORT MAN', 'PS MAN', 'PP120'],
  ['RAFFI AHMAD', 'SUPER STAR', 'RS121'],
  ['ROMANWIS', 'VS SECRET', 'RV122'],
  ['SCARLET SASA', 'SASA', 'SS123'],
  ['SELENA GOMES', 'SELEGO', 'SS124'],
  ['SEXY GRAVITY', 'SEXY GVT', 'SS125'],
  ['SILVER', 'SILVER', 'SS126'],
  ['SOFT', 'SOFT', 'SS127'],
  ['TAJ MAHAL', 'TAJ MAHAL', 'TT128'],
  ['TAYLOR SWIFT', 'SWEET BALE', 'TT129'],
  ['TISSUE', 'TISSUE', 'TT130'],
  ['VANILA', 'VANILA', 'VV131'],
  ['VANILASUSU', 'VANILA SUSU', 'VV132'],
  ['VANILLA COKLAT', 'SWEET CHOCOLATE', 'VS133'],
  ['VERSACE VERSUS', 'VV MAN', 'VV134'],
  ['VICTORIA SECRET', 'SECRET SCENT', 'VS135'],
  ['VS SCANDALOUS', 'SCANDAL', 'VS136'],
  ['VS SO SEXY', 'VS SO SEXY', 'VV137'],
  ['VS.BOMBSHELL', 'VS BOM SEL', 'VV138'],
  ['VS.VANILA LACE', 'VS VANILA LACE', 'VV139'],
  ['WOMEN ICE', 'WOMEN ICE', 'WW140'],
  ['ZARA LOVE', 'ZA LOVE', 'WW141'],
  ['ZARA MAN', 'ZA MAN', 'ZZ142'],
  ['ZARA WOMAN', 'ZA WOMEN', 'ZZ143'],
];

export default PRODUCT_DATA;
