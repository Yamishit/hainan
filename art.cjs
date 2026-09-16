const ink='#274B49', teal='#32B8B0', red='#F07869', yellow='#F6C95A', green='#83BC65';
const stroke=`stroke="${ink}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"`;
const ell=(x,y,rx,ry,fill)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const rect=(x,y,w,h,r,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke}/>`;
const p=(d,f,sw=3.4)=>`<path d="${d}" fill="${f}" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
const line=(d,c=ink,w=3.4)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
function face(x,y){return ell(x-9,y,2.4,3,ink)+ell(x+9,y,2.4,3,ink)+ell(x-15,y+6,4,2.5,'#F69F9B')+ell(x+15,y+6,4,2.5,'#F69F9B')+line(`M${x-4} ${y+7} Q${x} ${y+12} ${x+4} ${y+7}`,ink,2);}
function palm(x=30,y=40,s=1){return `<g transform="translate(${x},${y}) scale(${s})">${p('M0 60 Q8 32 1 0 L8 -1 Q20 27 12 61 Z','#CFAC73')}${p('M5 2 Q-19 -18 -34 5 Q-8 4 5 2 Z',green)}${p('M5 2 Q-7 -32 11 -35 Q22 -17 5 2Z','#64A953')}${p('M5 2 Q32 -21 43 3 Q21 2 5 2Z',green)}${p('M5 2 Q35 3 32 22 Q17 7 5 2Z','#64A953')}${ell(5,6,5,5,'#D79758')}</g>`;}
function arcade(){return rect(22,42,78,63,3,'#FFFDF4')+p('M18 44 L18 32 L36 32 Q59 5 83 32 L105 32 L105 44Z','#F1B095')+rect(34,49,15,20,7,teal)+rect(72,49,15,20,7,teal)+p('M33 104 V86 Q43 71 52 86 V104Z','#C3E2DB')+p('M68 104 V86 Q78 71 87 86 V104Z','#C3E2DB')+line('M24 73 H98','#CFAC73')+ell(61,31,6,6,'#FFF9E5');}
function boat(){return p('M10 80 Q60 89 109 78 L93 104 Q57 115 26 102Z',teal)+rect(37,53,49,27,4,'#FFEFBE')+rect(46,57,25,12,2,'#A7D9DF')+line('M62 20 V51')+p('M64 21 L93 29 L64 39Z',red)+line('M7 111 Q20 116 33 111 M43 115 Q59 120 75 115 M87 111 Q102 117 116 111','#6CBBB4',3);}
function bowl(){return ell(61,64,42,13,'#FFF6D4')+p('M19 64 Q24 106 61 106 Q97 106 103 64 Q60 84 19 64Z',red)+ell(61,62,37,10,'#D6E284')+ell(43,62,7,4,'#FFF7D8')+ell(72,61,6,4,'#FFF7D8')+line('M36 36 Q26 29 37 19 M59 36 Q48 29 60 18 M81 36 Q71 29 82 20','#769A90',3)+face(61,88);}
function hotel(){return rect(22,50,79,56,3,'#F8E2BC')+p('M7 54 Q22 43 27 33 L46 33 L55 18 L70 18 L80 33 L98 33 Q104 46 116 53 Q59 47 7 54Z','#679B8A')+line('M18 42 Q58 38 106 42','#285F57',4)+rect(48,67,29,39,10,'#B57451')+rect(29,66,13,22,1,'#FFFAED')+rect(83,66,12,22,1,'#FFFAED')+line('M10 113 Q34 105 59 112 Q85 121 111 111','#56BABB',7);}
function beach(castle=false){return ell(64,104,56,16,'#FFE2A2')+p('M9 102 Q40 95 63 105 Q87 115 119 108 L119 120 H2Z','#70CFCB',0)+palm(24,45,.6)+(castle?rect(62,82,42,26,1,'#EDC16F')+rect(58,71,14,37,1,'#EDC16F')+rect(95,70,13,38,1,'#EDC16F')+p('M57 71 L65 61 L73 71Z',red)+p('M94 70 L102 60 L110 70Z',red)+p('M77 108 V98 Q83 86 89 98 V108Z','#B18B4E'):p('M61 51 Q85 15 111 52Z',red)+line('M84 48 L78 92')+p('M65 91 L99 91 L99 97 L65 97Z','#FFFDF2'))+ell(95,18,11,11,yellow);}
function museum(){return rect(13,64,97,43,2,'#C5E7E5')+p('M5 61 L35 36 L56 53 L84 22 L116 61Z','#F5F8F1')+line('M34 38 L36 61 M56 53 L62 61 M83 26 L90 61','#71A8A2',2)+line('M27 67 V105 M44 67 V105 M62 67 V105 M80 67 V105 M98 67 V105','#3C8985',3)+p('M6 109 H116 L123 116 H0Z','#D8DCC7');}
function raft(){return p('M4 73 L73 45 L117 76 L48 114Z','#DAB47C')+line('M12 75 L49 101 L105 75 M30 65 L73 94 M50 58 L92 82 M26 91 L91 62','#336862',5)+rect(30,36,47,37,2,'#ABDFD2')+p('M23 36 L50 14 L84 36Z',red)+rect(49,48,15,26,1,'#588C84')+line('M5 113 Q21 105 35 114 M68 116 Q91 124 115 111','#53B8B7',4);}
function lighthouse(){return p('M48 110 L54 36 H68 L74 110 Z','#FFFDF8')+p('M51 36 L51 22 H71 L71 36 Z',red)+p('M46 22 H76 V16 H46 Z','#496F68')+p('M53 16 L61 4 L69 16 Z',red)+line('M54 62 H68',teal,4)+line('M52 86 H70',teal,4)+line('M40 110 H82',ink,3);}
function ferris(){return ell(61,58,40,40,'none')+line('M61 58 L61 18',teal,2)+line('M61 58 L95 38',teal,2)+line('M61 58 L95 78',teal,2)+line('M61 58 L61 98',teal,2)+line('M61 58 L27 78',teal,2)+line('M61 58 L27 38',teal,2)+ell(61,58,6,6,yellow)+line('M61 58 L45 114',ink,3)+line('M61 58 L77 114',ink,3)+ell(61,18,5,5,red)+ell(95,38,5,5,yellow)+ell(95,78,5,5,red)+ell(61,98,5,5,yellow)+ell(27,78,5,5,red)+ell(27,38,5,5,yellow);}
function cablecar(){return line('M10 25 L112 15',ink,3)+line('M61 19 L61 45',ink,3)+rect(40,45,42,48,8,yellow)+rect(46,51,30,22,3,'#DDF6F7')+line('M61 51 V73',ink,2)+line('M36 93 H86',teal,5)+ell(40,45,4,4,red)+ell(82,45,4,4,red);}
function car(){return rect(10,53,105,47,13,red)+p('M24 52 L35 29 H85 L103 54Z',red)+p('M40 34 H56 V53 H29Z','#C4EDEA')+p('M64 34 H83 L96 53 H64Z','#C4EDEA')+ell(35,101,13,13,ink)+ell(91,101,13,13,ink)+ell(35,101,6,6,'#FBF9E5')+ell(91,101,6,6,'#FBF9E5')+rect(99,68,15,8,3,yellow)+face(62,75);}
function child(){return ell(61,47,29,29,'#FFD5B8')+p('M32 43 Q29 10 56 14 Q83 4 89 38 Q74 32 66 22 Q52 45 32 43Z','#495D51')+face(61,47)+p('M43 77 Q60 68 81 77 L88 108 H35Z',teal)+line('M45 110 V119 M77 110 V119',ink,7)+p('M32 76 L42 64 L47 83Z',yellow);}
function icon(type){let body; switch(type){
  case 'arcade':body=arcade();break;
  case 'arcadepot':body=`<g transform="scale(.84)">${arcade()}</g><g transform="translate(61 64) scale(.47)">${bowl()}</g>`;break;
  case 'beach':body=beach();break;
  case 'boat':body=boat();break;
  case 'museum':body=museum();break;
  case 'raft':body=raft();break;
  case 'hotel':body=hotel();break;
  case 'hotpot':body=bowl();break;
  case 'castle':body=beach(true);break;
  case 'car':body=car();break;
  case 'child':body=child();break;
  case 'lighthouse':body=lighthouse();break;
  case 'ferris':body=ferris();break;
  case 'cablecar':body=cablecar();break;
  default:body=palm();
}
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -3 132 132" aria-hidden="true">${ell(62,115,44,7,'#275B4A14')}${body}</svg>`;
}
module.exports={icon,palm,car,child};
