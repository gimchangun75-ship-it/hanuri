// ==========================================================================
// 🎮 워드 나이츠 : 문맥의 수호자 — 메인 게임 엔진 및 UI 컨트롤러 (word_knights.js)
// ==========================================================================

// [1] 정품 100% 인식 표준 QRCode.js 엔진
var QRCode;!function(){function a(a){this.mode=c.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=[],d=0,e=this.data.length;e>d;d++){var f=this.data.charCodeAt(d);f>65536?(b[0]=240|(1835008&f)>>>18,b[1]=128|(258048&f)>>>12,b[2]=128|(4032&f)>>>6,b[3]=128|63&f):f>2048?(b[0]=224|(61440&f)>>>12,b[1]=128|(4032&f)>>>6,b[2]=128|63&f):f>128?(b[0]=192|(1984&f)>>>6,b[1]=128|63&f):b[0]=f,this.parsedData=this.parsedData.concat(b)}this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function j(a,b){this.totalCount=a,this.dataCount=b}function k(){this.buffer=[],this.length=0}function m(){return"undefined"!=typeof CanvasRenderingContext2D}function n(){var a=!1,b=navigator.userAgent;return/android/i.test(b)&&(a=!0,aMat=b.toString().match(/android ([0-9]\.[0-9])/i),aMat&&aMat[1]&&(a=parseFloat(aMat[1]))),a}function r(a,b){for(var c=1,e=s(a),f=0,g=l.length;g>=f;f++){var h=0;switch(b){case d.L:h=l[f][0];break;case d.M:h=l[f][1];break;case d.Q:h=l[f][2];break;case d.H:h=l[f][3]}if(h>=e)break;c++}if(c>l.length)throw new Error("Too long data");return c}function s(a){var b=encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}a.prototype={getLength:function(){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b){var c=new a(b);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(this.modules[a+c][b+d]=c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?!0:!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=f.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=0==b%2)},setupPositionAdjustPattern:function(){for(var a=f.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var g=-2;2>=g;g++)for(var h=-2;2>=h;h++)this.modules[d+g][e+h]=-2==g||2==g||-2==h||2==h||0==g&&0==h?!0:!1}},setupTypeNumber:function(a){for(var b=f.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=f.getBCHTypeInfo(c),e=0;15>e;e++){var g=!a&&1==(1&d>>e);6>e?this.modules[e][8]=g:8>e?this.modules[e+1][8]=g:this.modules[this.moduleCount-15+e][8]=g}for(var e=0;15>e;e++){var g=!a&&1==(1&d>>e);8>e?this.modules[8][this.moduleCount-e-1]=g:9>e?this.modules[8][15-e-1+1]=g:this.modules[8][15-e-1]=g}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,g=0,h=this.moduleCount-1;h>0;h-=2)for(6==h&&h--;;){for(var i=0;2>i;i++)if(null==this.modules[d][h-i]){var j=!1;g<a.length&&(j=1==(1&a[g]>>>e));var k=f.getMask(b,d,h-i);k&&(j=!j),this.modules[d][h-i]=j,e--,-1==e&&(g++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,d){for(var e=j.getRSBlocks(a,c),g=new k,h=0;h<d.length;h++){var i=d[h];g.put(i.mode,4),g.put(i.getLength(),f.getLengthInBits(i.mode,a)),i.write(g)}for(var l=0,h=0;h<e.length;h++)l+=e[h].dataCount;if(g.getLengthInBits()>8*l)throw new Error("code length overflow. ("+g.getLengthInBits()+">"+8*l+")");for(g.getLengthInBits()+4<=8*l&&g.put(0,4);0!=g.getLengthInBits()%8;)g.putBit(!1);for(;;){if(g.getLengthInBits()>=8*l)break;if(g.put(b.PAD0,8),g.getLengthInBits()>=8*l)break;g.put(b.PAD1,8)}return b.createBytes(g,e)},b.createBytes=function(a,b){for(var c=0,d=0,e=0,g=new Array(b.length),h=new Array(b.length),j=0;j<b.length;j++){var k=b[j].dataCount,l=b[j].totalCount-k;d=Math.max(d,k),e=Math.max(e,l),g[j]=new Array(k);for(var m=0;m<g[j].length;m++)g[j][m]=255&a.buffer[m+c];c+=k;var n=f.getErrorCorrectPolynomial(l),o=new i(g[j],n.getLength()-1),p=o.mod(n);h[j]=new Array(n.getLength()-1);for(var m=0;m<h[j].length;m++){var q=m+p.getLength()-h[j].length;h[j][m]=q>=0?p.get(q):0}}for(var r=0,m=0;m<b.length;m++)r+=b[m].totalCount;for(var s=new Array(r),t=0,m=0;d>m;m++)for(var j=0;j<b.length;j++)m<g[j].length&&(s[t++]=g[j][m]);for(var m=0;e>m;m++)for(var j=0;j<b.length;j++)m<h[j].length&&(s[t++]=h[j][m]);return s};for(var c={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},d={L:1,M:0,Q:3,H:2},e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;f.getBCHDigit(b)-f.getBCHDigit(f.G15)>=0;)b^=f.G15<<f.getBCHDigit(b)-f.getBCHDigit(f.G15);return(a<<10|b)^f.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;f.getBCHDigit(b)-f.getBCHDigit(f.G18)>=0;)b^=f.G18<<f.getBCHDigit(b)-f.getBCHDigit(f.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return f.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case e.PATTERN000:return 0==(b+c)%2;case e.PATTERN001:return 0==b%2;case e.PATTERN010:return 0==c%3;case e.PATTERN011:return 0==(b+c)%3;case e.PATTERN100:return 0==(Math.floor(b/2)+Math.floor(c/3))%2;case e.PATTERN101:return 0==b*c%2+b*c%3;case e.PATTERN110:return 0==(b*c%2+b*c%3)%2;case e.PATTERN111:return 0==(b*c%3+(b+c)%2)%2;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new i([1],0),c=0;a>c;c++)b=b.multiply(new i([1,g.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case c.MODE_NUMBER:return 10;case c.MODE_ALPHA_NUM:return 9;case c.MODE_8BIT_BYTE:return 8;case c.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case c.MODE_NUMBER:return 12;case c.MODE_ALPHA_NUM:return 11;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case c.MODE_NUMBER:return 14;case c.MODE_ALPHA_NUM:return 13;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||(0!=h||0!=i)&&g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,(0==j||4==j)&&(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},g={glog:function(a){if(1>a)throw new Error("glog("+a+")");return g.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return g.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},h=0;8>h;h++)g.EXP_TABLE[h]=1<<h;for(var h=8;256>h;h++)g.EXP_TABLE[h]=g.EXP_TABLE[h-4]^g.EXP_TABLE[h-5]^g.EXP_TABLE[h-6]^g.EXP_TABLE[h-8];for(var h=0;255>h;h++)g.LOG_TABLE[g.EXP_TABLE[h]]=h;i.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=g.gexp(g.glog(this.get(c))+g.glog(a.get(d)));return new i(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=g.glog(this.get(0))-g.glog(a.get(0)),c=new Array(this.getLength()),d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=g.gexp(g.glog(a.get(d))+b);return new i(c,0).mod(a)}},j.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],j.getRSBlocks=function(a,b){var c=j.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,e=[],f=0;d>f;f++)for(var g=c[3*f+0],h=c[3*f+1],i=c[3*f+2],k=0;g>k;k++)e.push(new j(h,i));return e},j.getRsBlockTable=function(a,b){switch(b){case d.L:return j.RS_BLOCK_TABLE[4*(a-1)+0];case d.M:return j.RS_BLOCK_TABLE[4*(a-1)+1];case d.Q:return j.RS_BLOCK_TABLE[4*(a-1)+2];case d.H:return j.RS_BLOCK_TABLE[4*(a-1)+3];default:return void 0}},k.prototype={get:function(a){var b=Math.floor(a/8);return 1==(1&this.buffer[b]>>>7-a%8)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(1&a>>>b-c-1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var l=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],o=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function g(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var b=this._htOption,c=this._el,d=a.getModuleCount();Math.floor(b.width/d),Math.floor(b.height/d),this.clear();var h=g("svg",{viewBox:"0 0 "+String(d)+" "+String(d),width:"100%",height:"100%",fill:b.colorLight});h.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),c.appendChild(h),h.appendChild(g("rect",{fill:b.colorDark,width:"1",height:"1",id:"template"}));for(var i=0;d>i;i++)for(var j=0;d>j;j++)if(a.isDark(i,j)){var k=g("use",{x:String(i),y:String(j)});k.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),h.appendChild(k)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),p="svg"===document.documentElement.tagName.toLowerCase(),q=p?o:m()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function d(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&_fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",void 0}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var b=1/window.devicePixelRatio,c=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,d,e,f,g,h,i,j){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*b;else"undefined"==typeof j&&(arguments[1]*=b,arguments[2]*=b,arguments[3]*=b,arguments[4]*=b);c.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=n(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&d.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();QRCode=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:d.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._android=n(),this._el=a,this._oQRCode=null,this._oDrawing=new q(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},QRCode.prototype.makeCode=function(a){this._oQRCode=new b(r(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=d}();

// [2] 워드 나이츠 메인 배틀 엔진 & 외부 시험문제 로더
// 🏛️ [온톨로지 수업반 & 학생 매핑 DB]
const ontologySchedules = window.WORD_KNIGHTS_DEFAULT_SCHEDULES || {};
let currentScheduleKey = "sched_mon_1430";
let currentGameMode = "brawl";

function onClassScheduleChange(schKey) {
    currentScheduleKey = schKey;
    const sch = ontologySchedules[schKey];
    if (!sch) return;

    // 학생 명단 교체
    students = JSON.parse(JSON.stringify(sch.students));
    currentStudentId = students[0] ? students[0].id : 1;

    // 학년별 유행 게임 모드 자동 연동
    const modeSelect = document.getElementById('game-mode-select');
    modeSelect.value = sch.gradeType;
    onGameModeChange(sch.gradeType);

    // 해당 교재 자동 선택
    const tbSelect = document.getElementById('textbook-select');
    tbSelect.value = sch.defaultBook;
    changeTextbook(sch.defaultBook);

    // UI 학생 리스트 갱신
    document.getElementById('online-students-count').innerText = students.length + "명";
    renderStudentGrid();
    renderPadStudentSelector();
}

function onGameModeChange(mode) {
    currentGameMode = mode;
    const body = document.body;
    body.classList.remove('theme-valorant', 'theme-roblox');

    const bossNameElem = document.getElementById('boss-name');
    const bossIconElem = bossNameElem ? bossNameElem.previousElementSibling : null;

    if (mode === 'valorant') {
        body.classList.add('theme-valorant');
        if (bossNameElem) bossNameElem.innerText = "스파이크 설치 구역 · 사이퍼 코어 (중등부 전술)";
        if (bossIconElem) bossIconElem.innerText = "🎯";
    } else if (mode === 'roblox') {
        body.classList.add('theme-roblox');
        if (bossNameElem) bossNameElem.innerText = "던전 보스 · 로블록스 수호령 (고학년 클랜전)";
        if (bossIconElem) bossIconElem.innerText = "👾";
    } else {
        if (bossNameElem) bossNameElem.innerText = "어휘 혼돈의 군주 · 보이드 (초등 브롤 레이드)";
        if (bossIconElem) bossIconElem.innerText = "👹";
    }
}

// 교재 라이브러리
const textbookLibrary = window.WORD_KNIGHTS_DEFAULT_LIBRARY || {};

// 외부 JSON 데이터(questions 배열 또는 chapters 배열)를 워드나이츠 표준 챕터 포맷으로 정규화
function normalizeExternalQuizJson(rawJson, fallbackTitle = "외부 문제집") {
    if (!rawJson) return { title: fallbackTitle, chapters: [] };
    if (Array.isArray(rawJson)) {
        rawJson = { bookTitle: fallbackTitle, questions: rawJson };
    }
    if (Array.isArray(rawJson.chapters) && rawJson.chapters.length > 0) {
        return {
            title: rawJson.title || rawJson.bookTitle || fallbackTitle,
            chapters: rawJson.chapters
        };
    }
    const questions = Array.isArray(rawJson.questions) ? rawJson.questions : [];
    const bookTitle = rawJson.bookTitle || rawJson.title || fallbackTitle;
    const chapterSub = rawJson.chapter || "";
    const fullTitle = (chapterSub && !bookTitle.includes(chapterSub))
        ? `${bookTitle} · ${chapterSub}`
        : bookTitle;

    const chapters = questions.map((q, idx) => {
        const qText = q.question || "";
        const shortQ = qText.length > 18 ? qText.slice(0, 18) + "..." : qText;
        return {
            name: q.name || shortQ || `${idx + 1}번 문제`,
            category: q.category || fullTitle,
            word: q.word || q.id || `Q${idx + 1}`,
            hanja: q.hanja || rawJson.theme || rawJson.chapter || "핵심 문제",
            funOrigin: q.funOrigin || q.explanation || "",
            example: q.example || q.explanation || "",
            question: qText,
            options: Array.isArray(q.options) && q.options.length > 0
                ? q.options
                : ["⭕ 그렇다 (O)", "❌ 아니다 (X)"],
            answer: typeof q.answer === "number" ? q.answer : parseInt(q.answer || "0", 10),
            explanation: q.explanation || "",
            damage: typeof q.damage === "number" ? q.damage : 30,
            dialogue: q.dialogue || q.bossDialogue || "크윽! 강력한 일격이다!"
        };
    });
    return { title: fullTitle, chapters };
}

// 외부 문제팩 객체를 textbookLibrary 및 상단 드롭다운(#textbook-select)에 즉시 등록
function registerExternalQuizPack(rawJson, fileName = "custom_quiz.json", autoSelect = true) {
    if (rawJson && !rawJson.questions && !rawJson.chapters && rawJson.sched_mon_1430) {
        Object.assign(ontologySchedules, rawJson);
        return null;
    }
    const cleanStem = String(fileName).replace(/\.json$/i, "");
    const norm = normalizeExternalQuizJson(rawJson, cleanStem);
    if (!norm.chapters || norm.chapters.length === 0) {
        console.warn("[워드나이츠] 유효한 문항(questions/chapters)이 없는 JSON 파일입니다:", fileName);
        return null;
    }
    const packKey = "ext_" + cleanStem.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
    const displayLabel = `📂 ${norm.title} (${norm.chapters.length}제)`;
    textbookLibrary[packKey] = {
        title: norm.title,
        label: displayLabel,
        sourceFile: fileName,
        chapters: norm.chapters
    };

    const tbSelect = document.getElementById("textbook-select");
    if (tbSelect) {
        let opt = Array.from(tbSelect.options).find(o => o.value === packKey);
        if (!opt) {
            opt = document.createElement("option");
            opt.value = packKey;
            tbSelect.appendChild(opt);
        }
        opt.textContent = displayLabel;
        if (autoSelect) {
            tbSelect.value = packKey;
            changeTextbook(packKey);
        }
    }
    return { key: packKey, title: norm.title, count: norm.chapters.length };
}

// 📂 [문제 파일 열기] (<input type="file" accept=".json">) 핸들러
function handleExternalQuizFileUpload(event) {
    const files = event && event.target && event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    let lastLoadedInfo = null;
    let processed = 0;

    files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const rawJson = JSON.parse(e.target.result);
                const isLast = (idx === files.length - 1);
                const info = registerExternalQuizPack(rawJson, file.name, isLast);
                if (info) lastLoadedInfo = info;
            } catch (err) {
                console.error("[워드나이츠] 외부 문제 JSON 파싱 오류:", file.name, err);
            } finally {
                processed++;
                if (processed === files.length && lastLoadedInfo) {
                    const bannerText = document.getElementById("arena-start-banner-text");
                    if (bannerText) {
                        bannerText.innerText = `📂 [${lastLoadedInfo.title} · ${lastLoadedInfo.count}문제] 로드 완료! [▶️ 문제 시작]을 눌러주세요`;
                    }
                    if (event.target) event.target.value = "";
                }
            }
        };
        reader.readAsText(file, "utf-8");
    });
}

// 참여 학생 리스트
let students = [
    { id: 1, name: "민우", role: "⚔️ 기사", score: 350, answered: false, answerIdx: null, isCorrect: false },
    { id: 2, name: "서연", role: "🏹 궁수", score: 420, answered: false, answerIdx: null, isCorrect: false },
    { id: 3, name: "도윤", role: "🔮 법사", score: 380, answered: false, answerIdx: null, isCorrect: false },
    { id: 4, name: "지아", role: "🌿 힐러", score: 400, answered: false, answerIdx: null, isCorrect: false }
];

let currentStudentId = 1;
let currentBookKey = "dada_1";
let currentChapterIdx = 0;
let activeQuiz = textbookLibrary.dada_1.chapters[0];

let bossHp = 100;
let timer = 20;
let timerInterval = null;
let bgmInterval = null;
let isBgmPlaying = false;
let isMuted = false;
let boxTapsRemaining = 3;

let audioCtx = null;
let masterGainNode = null;
let currentMasterVolume = 0.6;

// ----------------------------------------------------
// 🔄 뷰 모드 스위처 (교실 트윈 뷰 / 플립 65인치 / 학생 폰 패드)
// ----------------------------------------------------
function switchViewMode(mode) {
    const root = document.getElementById('app-root');
    const secBoard = document.getElementById('section-board');
    const secPad = document.getElementById('section-pad');
    const badge = document.getElementById('current-view-badge');

    // 탭 스타일 초기화
    ['twin', 'board', 'student'].forEach(m => {
        const tab = document.getElementById(`tab-${m}`);
        if (tab) tab.className = "px-2.5 py-1 rounded-lg font-bold text-slate-400 hover:text-white transition";
    });
    const activeTab = document.getElementById(`tab-${mode}`);
    if (activeTab) activeTab.className = "px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white transition";

    if (mode === 'board') {
        // 🖥️ 플립 65인치 전자칠판 전용 모드
        document.body.classList.remove('student-mobile-layout');
        root.className = "max-w-7xl w-full mx-auto flex-1 flex flex-col font-noto scale-normal";
        secBoard.className = "w-full flex-1 bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden";
        secPad.classList.add('hidden');
        badge.innerText = "🖥️ 플립 65인치 단독 뷰";
    } else if (mode === 'student') {
        // 📱 학생 스마트폰 전용 100vh 핏 모드 (스크롤 원천 차단)
        document.body.classList.add('student-mobile-layout');
        root.className = "w-full h-full flex flex-col font-noto scale-normal p-0 m-0";
        secBoard.classList.add('hidden');
        secPad.className = "w-full h-full bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl p-2.5 flex flex-col justify-between shadow-2xl relative";
        secPad.classList.remove('hidden');
        badge.innerText = "📱 학생 폰 컨트롤러";
    } else {
        // 📺 교실 트윈 뷰 (기본)
        document.body.classList.remove('student-mobile-layout');
        root.className = "max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 font-noto scale-normal";
        secBoard.className = "lg:col-span-7 bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden";
        secPad.className = "lg:col-span-5 bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-2xl relative";
        secBoard.classList.remove('hidden');
        secPad.classList.remove('hidden');
        badge.innerText = "📺 교실 트윈 뷰";
    }
}

// ----------------------------------------------------
// 📲 정품 QRCode.js 기반 100% 표준 인식 QR 렌더러 (한글 URL 완전 지원)
// ----------------------------------------------------
function renderNativeQrCode(containerId, text) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    try {
        // 한글 및 특수문자 URI 인코딩 (QR 규격 8bit 바이트 호환성 100% 보장)
        const safeUrl = encodeURI(text);

        new QRCode(container, {
            text: safeUrl,
            width: 230,
            height: 230,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
        });
    } catch (e) {
        console.error("QR Generation Error:", e);
        container.innerHTML = '<div class="p-4 text-slate-800 text-xs font-bold">QR 생성 오류: ' + e.message + '</div>';
    }
}

// ----------------------------------------------------
// 🌐 [100% 무결점 스마트 Zero-Touch URL 감지 엔진]
// 웹(GitHub Pages)에 띄우면 자동으로 그 웹 주소로 QR 생성!
// ----------------------------------------------------
function getStudentTargetUrl() {
    // 현재 브라우저가 열고 있는 실제 주소 (GitHub Pages든, 로컬 서버든 무조건 100% 일치)
    const currentUrl = window.location.href.split('?')[0];

    if (currentUrl.startsWith('file:///')) {
        // PC 로컬 파일로 열었을 때만 로컬 IP 적용
        let host = localStorage.getItem('hanuri_game_host_ip') || "192.168.10.223:8080";
        return `http://${host}/game.html?role=student`;
    } else {
        // 🌟 인터넷 웹(GitHub Pages 등)에서 열었을 때는 무조건 현재 주소 기반 자동 생성!
        // 예: https://gimchangun75-ship-it.github.io/hanuri/game.html?role=student
        return `${currentUrl}?role=student`;
    }
}

function updateQrTargetUrl() {
    const targetUrl = getStudentTargetUrl();
    const urlElem = document.getElementById('qr-local-url');
    if (urlElem) urlElem.innerText = targetUrl;

    // 실시간 정품 규격 QR코드 즉각 재생성
    renderNativeQrCode('qrcode-canvas', targetUrl);
}

function openQrModal() {
    const modal = document.getElementById('qr-modal');
    modal.classList.remove('hidden');

    // 현재 접속 환경(웹 vs 로컬)에 따라 안내 UI 조정
    const hostIpContainer = document.getElementById('custom-host-ip-container');
    const isWeb = !window.location.href.startsWith('file:///');

    if (isWeb && hostIpContainer) {
        // 웹에선 IP 입력창 숨기고 깔끔하게 웹 주소 안내
        hostIpContainer.classList.add('hidden');
    } else if (hostIpContainer) {
        hostIpContainer.classList.remove('hidden');
    }

    updateQrTargetUrl();
    initAudio();
}

function closeQrModal() {
    document.getElementById('qr-modal').classList.add('hidden');
}

function openStudentTabDirect() {
    const targetUrl = getStudentTargetUrl();
    window.open(targetUrl, "_blank");
}

// ----------------------------------------------------
// 🔊 오디오 및 사운드 시스템
// ----------------------------------------------------
function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.setValueAtTime(isMuted ? 0 : currentMasterVolume, audioCtx.currentTime);
        masterGainNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById('mute-icon');
    if (isMuted) {
        icon.className = "fa-solid fa-volume-xmark text-rose-500";
        if (masterGainNode) masterGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    } else {
        icon.className = "fa-solid fa-volume-high text-amber-400";
        if (masterGainNode) masterGainNode.gain.setValueAtTime(currentMasterVolume, audioCtx.currentTime);
    }
}

function changeMasterVolume(val) {
    currentMasterVolume = parseFloat(val);
    if (!isMuted && masterGainNode) {
        masterGainNode.gain.setValueAtTime(currentMasterVolume, audioCtx.currentTime);
    }
}

function toggleBGM() {
    initAudio();
    const btn = document.getElementById('bgm-toggle-btn');
    const txt = document.getElementById('bgm-status-text');
    if (isBgmPlaying) {
        stopBGM();
        txt.innerText = "BGM OFF";
        btn.className = "px-2.5 py-1.5 rounded-xl font-bold bg-slate-800 text-slate-400 border border-slate-700";
    } else {
        startBGM();
        txt.innerText = "BGM ON";
        btn.className = "px-2.5 py-1.5 rounded-xl font-bold bg-indigo-600 text-white border border-indigo-400 shadow-lg";
    }
}

function startBGM() {
    if (isBgmPlaying || isMuted) return;
    isBgmPlaying = true;
    let step = 0;
    const bassline = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 98];

    bgmInterval = setInterval(() => {
        if (!isBgmPlaying || isMuted) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassline[step % bassline.length], now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(masterGainNode);
        osc.start(now);
        osc.stop(now + 0.22);
        step++;
    }, 230);
}

function stopBGM() {
    isBgmPlaying = false;
    clearInterval(bgmInterval);
}

const SoundFX = {
    playTick: (remainingSeconds) => {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const isUrgent = remainingSeconds <= 5;
        const freq = isUrgent ? (700 + (6 - remainingSeconds) * 90) : 440;
        const duration = isUrgent ? 0.04 : 0.03;
        osc.type = isUrgent ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(isUrgent ? 0.28 : 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(masterGainNode);
        osc.start(now);
        osc.stop(now + duration);
    },
    playCorrect: () => {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        const notes = [587.33, 739.99, 880.00, 1174.66];
        notes.forEach((f, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now + (idx * 0.07));
            gain.gain.setValueAtTime(0.24, now + (idx * 0.07));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.07) + 0.3);
            osc.connect(gain);
            gain.connect(masterGainNode);
            osc.start(now + (idx * 0.07));
            osc.stop(now + (idx * 0.07) + 0.3);
        });
    },
    playHit: () => {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(masterGainNode);
        osc.start(now);
        osc.stop(now + 0.25);
    },
    playWrong: () => {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.45);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(masterGainNode);
        osc.start(now);
        osc.stop(now + 0.45);
    },
    playBoxTap: (tapCount) => {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const freqMap = { 2: 140, 1: 200, 0: 320 };
        const f = freqMap[tapCount] || 150;
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.5, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(masterGainNode);
        osc.start(now);
        osc.stop(now + 0.12);
    },
    playLegendaryOpen: () => {
        if (isMuted) return;
        initAudio();
        stopBGM();
        const chords = [[523.25, 659.25, 783.99], [587.33, 739.99, 880.00], [783.99, 987.77, 1174.66, 1567.98]];
        let cur = audioCtx.currentTime;
        chords.forEach((chord, idx) => {
            const delay = idx * 0.16;
            chord.forEach(freq => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = (idx === 2) ? 'sawtooth' : 'triangle';
                osc.frequency.setValueAtTime(freq, cur + delay);
                gain.gain.setValueAtTime(0.25, cur + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, cur + delay + 0.8);
                osc.connect(gain);
                gain.connect(masterGainNode);
                osc.start(cur + delay);
                osc.stop(cur + delay + 0.8);
            });
        });
    }
};

// ----------------------------------------------------
// 📏 전역 글씨 크기 스케일러
// ----------------------------------------------------
function changeAppSize(sizeKey) {
    const root = document.getElementById('app-root');
    root.classList.remove('scale-normal', 'scale-large', 'scale-xlarge');

    const btnNormal = document.getElementById('size-btn-normal');
    const btnLarge = document.getElementById('size-btn-large');
    const btnXlarge = document.getElementById('size-btn-xlarge');

    [btnNormal, btnLarge, btnXlarge].forEach(b => {
        if (b) b.className = "px-2 py-1 text-xs rounded-lg font-bold text-slate-400 hover:text-white transition";
    });

    if (sizeKey === 'large') {
        root.classList.add('scale-large');
        if (btnLarge) btnLarge.className = "px-2 py-1 text-xs rounded-lg font-bold bg-indigo-600 text-white transition shadow";
    } else if (sizeKey === 'xlarge') {
        root.classList.add('scale-xlarge');
        if (btnXlarge) btnXlarge.className = "px-2 py-1 text-xs rounded-lg font-bold bg-indigo-600 text-white transition shadow";
    } else {
        root.classList.add('scale-normal');
        if (btnNormal) btnNormal.className = "px-2 py-1 text-xs rounded-lg font-bold bg-indigo-600 text-white transition shadow";
    }
    initAudio();
}

// ----------------------------------------------------
// 🎮 게임 플레이 및 문제 전환 로직
// ----------------------------------------------------
function changeTextbook(bookKey) {
    currentBookKey = bookKey;
    resetBattleState();
    currentChapterIdx = 0;
    const chapSelect = document.getElementById('chapter-select');
    if (chapSelect && textbookLibrary[currentBookKey] && textbookLibrary[currentBookKey].chapters) {
        const chaps = textbookLibrary[currentBookKey].chapters;
        chapSelect.innerHTML = chaps.map((c, i) => `<option value="${i}">${c.name || (i+1) + '번 문제'}</option>`).join('');
        chapSelect.value = "0";
    }
    activeQuiz = textbookLibrary[currentBookKey].chapters[0];
    loadCurrentQuiz(activeQuiz);
}

function changeChapter(chapIdx) {
    currentChapterIdx = parseInt(chapIdx);
    activeQuiz = textbookLibrary[currentBookKey].chapters[currentChapterIdx];
    loadCurrentQuiz(activeQuiz);
}

function loadCurrentQuiz(quiz) {
    // 새 문제 = 새 라운드: 이전 문제에 걸린 예약 작업·입력 잠금 전부 초기화
    roundToken++;
    cancelRoundTimers();
    roundLocked = false;
    isTransitioningQuiz = false;
    clearInterval(timerInterval);

    resetShellyToHome();
    activeQuiz = quiz;
    document.getElementById('board-category-tag').innerText = quiz.category;
    document.getElementById('board-question-text').innerText = quiz.question;
    document.getElementById('pad-question-preview').innerText = quiz.question;
    document.getElementById('board-boss-dialogue').innerText = `"${quiz.dialogue}"`;

    // 학생 응답 초기화
    students.forEach(s => {
        s.answered = false;
        s.answerIdx = null;
        s.isCorrect = false;
    });

    renderStudentGrid();
    renderPadOptions();
    document.getElementById('pad-explanation-text').innerText = "문제를 맞히면 이곳에 정확한 어휘 뜻과 문맥 풀이가 나타납니다!";
    document.getElementById('all-answered-badge').classList.add('hidden');

    renderTargetBoxes();
    updateQuizControlUI();
    if (isQuizStarted && !isQuizPaused) {
        document.getElementById('pad-submit-status').innerText = "🔥 배틀 진행 중! 정답 상자를 타격하세요!";
        document.getElementById('pad-submit-status').className = "text-[11px] text-amber-300 font-bold";
        startTimer(20);
    } else {
        timer = 20;
        updateTimerDisplay();
        checkPoisonGas(20);
        document.getElementById('pad-submit-status').innerText = "⏸ 선생님 출제 대기 중...";
        document.getElementById('pad-submit-status').className = "text-[11px] text-slate-400";
    }
}

function renderStudentGrid() {
    const grid = document.getElementById('students-grid');
    grid.innerHTML = '';

    students.forEach(s => {
        const card = document.createElement('div');
        let statusBg = "bg-slate-900 border-slate-800 text-slate-400";
        let statusText = "응답 대기";

        if (s.answered) {
            statusBg = "bg-amber-950/70 border-amber-500/80 text-amber-300";
            statusText = `선택: ${s.answerIdx + 1}번`;
        }

        card.className = `p-2 rounded-xl border flex flex-col justify-between ${statusBg} transition-all duration-300`;
        card.innerHTML = `
            <div class="flex items-center justify-between mb-1">
                <span class="font-bold dynamic-status-name text-slate-200">${s.role} ${s.name}</span>
                <span class="text-[10px] text-amber-400 font-bold">${s.score}P</span>
            </div>
            <div class="text-[11px] font-black text-center py-0.5 rounded bg-slate-950/80 border border-slate-800/80">
                ${statusText}
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderPadOptions() {
    const container = document.getElementById('pad-options-container');
    container.innerHTML = '';

    activeQuiz.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        // 브롤 컬러: 1번 청록, 2번 파랑, 3번 주황, 4번 노랑
        const colorClasses = [
            "brawl-btn-blue",
            "brawl-btn-orange",
            "brawl-btn-blue",
            "brawl-btn-orange"
        ];
        const bgClass = colorClasses[idx % colorClasses.length];

        btn.className = `w-full brawl-btn-3d ${bgClass} py-2 px-3 text-center slim-action-btn font-black cursor-pointer`;
        btn.innerHTML = `
            <div class="flex flex-col items-center justify-center py-1 px-2 text-center">
                <span class="text-xs font-black text-amber-200 bg-black/50 px-2.5 py-0.5 rounded-full mb-1 border border-black/30">
                    선택지 ${idx + 1}
                </span>
                <span class="text-base sm:text-xl font-black text-white tracking-tight leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" style="font-family: 'Noto Sans KR', sans-serif;">
                    ${opt}
                </span>
            </div>
        `;
        btn.onclick = () => submitPadAnswer(idx);
        container.appendChild(btn);
    });
}


// 📱 학생 폰 화면 쉘리 사격 & 보스 피격 애니메이션 트리거
function triggerPadShellyAttack() {
    // 모바일 진동 피드백 (손끝 타격감)
    if (navigator.vibrate) {
        navigator.vibrate([50, 40, 80]);
    }

    const padShelly = document.getElementById('pad-shelly-avatar');
    if (padShelly) {
        padShelly.classList.add('living-shelly-shoot');
        setTimeout(() => padShelly.classList.remove('living-shelly-shoot'), 450);
    }

    const padField = document.getElementById('pad-brawl-field');
    if (padField) {
        // 폰 화면 3연발 미니 탄환
        for (let i = -1; i <= 1; i++) {
            const bullet = document.createElement('div');
            bullet.className = "brawl-bullet";
            bullet.style.left = "60px";
            bullet.style.top = `${45 + i * 12}%`;
            bullet.style.width = "16px";
            bullet.style.height = "8px";
            padField.appendChild(bullet);

            setTimeout(() => {
                bullet.style.left = "calc(100% - 70px)";
                bullet.style.transform = `scale(1.8) rotate(${i * 15}deg)`;
            }, 20);

            setTimeout(() => bullet.remove(), 320);
        }

        // 0.32초 후 폰 보스 피격 쾅!
        setTimeout(() => {
            const padBoss = document.getElementById('pad-boss-sprite');
            if (padBoss) {
                padBoss.classList.add('living-boss-hit');
                setTimeout(() => padBoss.classList.remove('living-boss-hit'), 450);
            }

            // 폰 화면 폭발 마크
            const boom = document.createElement('div');
            boom.className = "epic-hit-explosion";
            boom.style.right = "20px";
            boom.style.fontSize = "3rem";
            boom.innerText = "💥";
            padField.appendChild(boom);
            setTimeout(() => boom.remove(), 600);

            // 폰 화면 파워 큐브 획득 연동
            const padCubeElem = document.getElementById('pad-cube-count');
            if (padCubeElem) padCubeElem.innerText = playerPowerCubes;
        }, 320);
    }
}


// ====================================================
// 🌟 [스마트 원클릭 출석 & 기기 영구 기억 & 누적 DB 엔진]
// ====================================================
const LOCAL_STORAGE_DEVICE_KEY = "brawl_knights_student_device";
const LOCAL_STORAGE_DB_KEY = "brawl_knights_global_db";

// 전역 학생 누적 점수 DB 초기화 및 로드
let studentDB = {};
function initStudentDB() {
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
        if (saved) {
            studentDB = JSON.parse(saved);
        } else {
            // 기본 DB 씨앗 데이터
            studentDB = {
                "손연수": { name: "손연수", role: "⚔️ 기사", score: 850, tier: "골드 기사 🏆", solved: 18, correct: 17 },
                "이예준": { name: "이예준", role: "🏹 궁수", score: 720, tier: "실버 기사 🛡️", solved: 15, correct: 13 },
                "이지성": { name: "이지성", role: "🔮 법사", score: 680, tier: "실버 기사 🛡️", solved: 14, correct: 12 },
                "심창현": { name: "심창현", role: "⚔️ 기사", score: 950, tier: "골드 기사 🏆", solved: 20, correct: 19 },
                "강태준": { name: "강태준", role: "⚔️ 기사", score: 550, tier: "브론즈 기사 🗡️", solved: 12, correct: 10 },
                "강유승": { name: "강유승", role: "🌿 힐러", score: 600, tier: "브론즈 기사 🗡️", solved: 13, correct: 11 },
                "정주원": { name: "정주원", role: "🏹 궁수", score: 580, tier: "브론즈 기사 🗡️", solved: 12, correct: 10 },
                "하서현": { name: "하서현", role: "🔮 법사", score: 890, tier: "골드 기사 🏆", solved: 19, correct: 18 },
                "김나희": { name: "김나희", role: "⚔️ 기사", score: 740, tier: "실버 기사 🛡️", solved: 16, correct: 14 },
                "추지후": { name: "추지후", role: "🏹 궁수", score: 710, tier: "실버 기사 🛡️", solved: 15, correct: 13 },
                "허유진": { name: "허유진", role: "🌿 힐러", score: 820, tier: "골드 기사 🏆", solved: 17, correct: 15 },
                "민우":   { name: "민우", role: "⚔️ 기사", score: 750, tier: "실버 기사 🛡️", solved: 16, correct: 14 },
                "서연":   { name: "서연", role: "🏹 궁수", score: 820, tier: "골드 기사 🏆", solved: 17, correct: 16 },
                "도윤":   { name: "도윤", role: "🔮 법사", score: 680, tier: "실버 기사 🛡️", solved: 15, correct: 13 },
                "지아":   { name: "지아", role: "🌿 힐러", score: 910, tier: "다이아 기사 💎", solved: 20, correct: 19 }
            };
            saveStudentDB();
        }
    } catch(e) {
        console.error("DB 로드 오류:", e);
    }
}

function saveStudentDB() {
    try {
        localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(studentDB));
    } catch(e) {}
}

// 📱 기기 자동 로그인 체크 (페이지 로드 시 1회 실행)
function checkDeviceAutoLogin() {
    initStudentDB();
    try {
        const savedUser = localStorage.getItem(LOCAL_STORAGE_DEVICE_KEY);
        if (savedUser) {
            const user = JSON.parse(savedUser);
            applyUserLogin(user.name, user.role, false);
            console.log(`⚡ 기기 자동 로그인 완료: ${user.name} (${user.role})`);
        } else {
            // 첫 접속 기기: 스마트 출석 모달 팝업!
            setTimeout(openAttendanceModal, 600);
        }
    } catch(e) {
        setTimeout(openAttendanceModal, 600);
    }
}

// 출석 모달 열기 (현재 반 학생 명단 버튼 생성)
function openAttendanceModal() {
    const container = document.getElementById('attendance-student-buttons');
    if (!container) return;
    container.innerHTML = '';

    // 현재 수업 스케줄의 학생 목록
    const sch = ontologySchedules[currentScheduleKey];
    const currentClassStudents = sch ? sch.students : students;

    currentClassStudents.forEach(s => {
        const btn = document.createElement('button');
        btn.className = "w-full py-3 px-4 brawl-btn-3d brawl-btn-orange text-left flex items-center justify-between cursor-pointer";
        btn.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-xl">🤠</span>
                <div>
                    <p class="brawl-text text-white text-base leading-none">${s.name} 기사</p>
                    <p class="text-[10px] text-amber-200 font-bold">${s.role} · ${sch ? sch.courseCode + '반' : '학생'}</p>
                </div>
            </div>
            <span class="text-xs bg-black/50 text-white font-black px-2 py-1 rounded-lg border border-black/40">이 폰으로 출석! ⚡</span>
        `;
        btn.onclick = () => selectStudentAndRemember(s.name, s.role);
        container.appendChild(btn);
    });

    document.getElementById('smart-attendance-modal').classList.remove('hidden');
}

// 학생이 자기 이름을 1초 탭했을 때 영구 기억 및 로그인
function selectStudentAndRemember(studentName, role) {
    initAudio();
    const deviceUser = {
        name: studentName,
        role: role,
        registeredAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_DEVICE_KEY, JSON.stringify(deviceUser));

    applyUserLogin(studentName, role, true);
    document.getElementById('smart-attendance-modal').classList.add('hidden');

    SoundFX.playSuperReady();
    alert(`🎉 환영합니다, ${studentName} 기사님!\n이 핸드폰이 ${studentName} 기사님의 전용 패드로 영구 등록되었습니다! ⚡`);
}

// 게스트 입장
function closeAttendanceModalDirect(guestName) {
    applyUserLogin(guestName, "⚔️ 기사", false);
    document.getElementById('smart-attendance-modal').classList.add('hidden');
}

// 기기 변경 (로그아웃 후 재선택)
function resetDeviceLogin() {
    if (confirm("이 핸드폰의 기사 등록을 해제하고 다른 이름으로 변경하시겠습니까?")) {
        localStorage.removeItem(LOCAL_STORAGE_DEVICE_KEY);
        openAttendanceModal();
    }
}

// 사용자 로그인 정보 UI 및 DB 반영
function applyUserLogin(studentName, role, isFirstTime) {
    // 1. 학생 객체 찾기 또는 동적 바인딩
    let targetStudent = students.find(s => s.name === studentName);
    if (!targetStudent) {
        targetStudent = students[0]; // fallback
    }
    currentStudentId = targetStudent.id;

    // 2. 누적 DB에서 점수 가져오기
    if (!studentDB[studentName]) {
        studentDB[studentName] = {
            name: studentName,
            role: role,
            score: 500,
            tier: "브론즈 기사 🗡️",
            solved: 0,
            correct: 0
        };
        saveStudentDB();
    }
    const record = studentDB[studentName];
    targetStudent.score = record.score;

    // 3. UI 갱신
    const nameSel = document.getElementById('student-id-select');
    if (nameSel) nameSel.value = String(targetStudent.id);
    const avatarElem = document.getElementById('pad-student-avatar');
    if (avatarElem && role) avatarElem.innerText = role.split(' ')[0];
    document.getElementById('pad-student-score').innerText = record.score;

    renderStudentGrid();
}

// 정답 시 누적 점수 DB 자동 업데이트
function addScoreToStudentDB(studentName, earnedPoints) {
    if (!studentDB[studentName]) {
        studentDB[studentName] = { name: studentName, role: "⚔️ 기사", score: 0, tier: "브론즈 🗡️", solved: 0, correct: 0 };
    }
    const rec = studentDB[studentName];
    rec.score += earnedPoints;
    rec.solved += 1;
    rec.correct += 1;

    // 티어 자동 승급 계산
    if (rec.score >= 1200) rec.tier = "다이아 기사 💎";
    else if (rec.score >= 900) rec.tier = "골드 기사 🏆";
    else if (rec.score >= 650) rec.tier = "실버 기사 🛡️";
    else rec.tier = "브론즈 기사 🗡️";

    saveStudentDB();
}

// 🏆 [랭킹 보드 모달] 열기 & 렌더링
function openRankingModal() {
    initStudentDB();
    const container = document.getElementById('ranking-list-container');
    if (!container) return;
    container.innerHTML = '';

    // 점수 내림차순 정렬
    const sorted = Object.values(studentDB).sort((a, b) => b.score - a.score);

    sorted.forEach((item, index) => {
        let medal = `${index + 1}위`;
        let rankBg = "bg-slate-900 border-slate-700";
        if (index === 0) { medal = "🥇 1위 (MVP)"; rankBg = "bg-amber-950/80 border-amber-400"; }
        else if (index === 1) { medal = "🥈 2위"; rankBg = "bg-slate-800 border-slate-400"; }
        else if (index === 2) { medal = "🥉 3위"; rankBg = "bg-amber-950/40 border-amber-700"; }

        const row = document.createElement('div');
        row.className = `p-3 rounded-xl border ${rankBg} flex items-center justify-between`;
        row.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="font-black text-amber-300 text-sm sm:text-base w-20">${medal}</span>
                <div>
                    <p class="brawl-text text-white text-base leading-none">${item.name} (${item.role})</p>
                    <p class="text-[11px] text-slate-300 font-bold">${item.tier} · 정답률 ${item.solved > 0 ? Math.round((item.correct / item.solved) * 100) : 100}%</p>
                </div>
            </div>
            <div class="text-right">
                <span class="text-base font-black text-amber-400 font-mono">${item.score}</span>
                <span class="text-xs text-amber-200">점</span>
            </div>
        `;
        container.appendChild(row);
    });

    document.getElementById('brawl-ranking-modal').classList.remove('hidden');
}

function closeRankingModal() {
    document.getElementById('brawl-ranking-modal').classList.add('hidden');
}



// ====================================================
// 📦 [워드나이츠 2.0 타깃 상자 파밍 & HP 증감 배틀 엔진]
// (2026-10-26 복원·정비: run_and_gun 작업 중 유실된 함수 복원 + 문제 전환 단일화)
// ====================================================
let playerCurrentHp = 5100;
const PLAYER_MAX_HP = 5100;

// 💥 쇼다운 배틀 상태 (run_and_gun 작업 중 유실 → 복원)
let playerPowerCubes = 0;
let superAttackCharge = 0; // 0, 1, 2, 3 (3=100%)
let aliveBrawlers = 10;

// 🔒 문제(라운드) 상태 관리: 문제가 바뀌면 이전 문제에 걸린 예약 작업은 전부 무효
let roundToken = 0;          // 문제 세대 번호 (loadCurrentQuiz 때마다 +1)
let roundLocked = false;     // 답 선택/시간 초과 후 추가 입력 잠금
let isTransitioningQuiz = false;
let isQuizStarted = false;   // 선생님이 [문제 시작]을 눌렀는지 여부 (기본값 false = 출제 대기)
let isQuizPaused = false;    // 문제 진행 중 일시정지 여부
let pendingRoundTimers = [];

// 🚦 선생님 문제 시작 / 일시정지 UI 및 상태 제어
function updateQuizControlUI() {
    const topBtn = document.getElementById('btn-start-quiz');
    const topIcon = document.getElementById('btn-start-quiz-icon');
    const topLabel = document.getElementById('btn-start-quiz-label');

    const boardBtn = document.getElementById('btn-board-start-quiz');
    const boardIcon = document.getElementById('btn-board-start-icon');
    const boardLabel = document.getElementById('btn-board-start-label');

    const stateBadge = document.getElementById('quiz-state-badge');
    const arenaBanner = document.getElementById('arena-start-banner');
    const arenaBannerText = document.getElementById('arena-start-banner-text');

    if (!isQuizStarted) {
        if (topBtn) topBtn.className = "px-3 py-1 text-xs rounded-xl font-black bg-emerald-500 text-slate-950 border-2 border-black shadow hover:bg-emerald-400 transition-all flex items-center mr-1.5 cursor-pointer animate-pulse";
        if (topIcon) topIcon.innerText = "▶️";
        if (topLabel) topLabel.innerText = "문제 시작";

        if (boardBtn) boardBtn.className = "px-3 py-1 text-xs rounded-xl font-black bg-emerald-500 text-slate-950 border-2 border-black shadow hover:bg-emerald-400 transition-all flex items-center cursor-pointer animate-pulse";
        if (boardIcon) boardIcon.innerText = "▶️";
        if (boardLabel) boardLabel.innerText = "문제 시작";

        if (stateBadge) {
            stateBadge.innerText = "⏸ 출제 대기 중";
            stateBadge.className = "px-2.5 py-0.5 text-[11px] font-black rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60";
        }
        if (arenaBanner) arenaBanner.classList.remove('hidden');
        if (arenaBannerText) arenaBannerText.innerText = "선생님 [문제 시작]을 누르면 20초 타이머가 작동합니다! (클릭하여 시작)";
    } else if (isQuizPaused) {
        if (topBtn) topBtn.className = "px-3 py-1 text-xs rounded-xl font-black bg-amber-400 text-slate-950 border-2 border-black shadow hover:bg-amber-300 transition-all flex items-center mr-1.5 cursor-pointer animate-pulse";
        if (topIcon) topIcon.innerText = "▶️";
        if (topLabel) topLabel.innerText = "계속하기";

        if (boardBtn) boardBtn.className = "px-3 py-1 text-xs rounded-xl font-black bg-amber-400 text-slate-950 border-2 border-black shadow hover:bg-amber-300 transition-all flex items-center cursor-pointer animate-pulse";
        if (boardIcon) boardIcon.innerText = "▶️";
        if (boardLabel) boardLabel.innerText = "계속하기";

        if (stateBadge) {
            stateBadge.innerText = "⏸ 일시정지됨";
            stateBadge.className = "px-2.5 py-0.5 text-[11px] font-black rounded-full bg-amber-950 text-amber-300 border border-amber-500/60";
        }
        if (arenaBanner) arenaBanner.classList.remove('hidden');
        if (arenaBannerText) arenaBannerText.innerText = `⏸ 일시정지 중 (남은 시간 ${timer}초) — 다시 누르면 계속 진행됩니다!`;
    } else {
        if (topBtn) topBtn.className = "px-3 py-1 text-xs rounded-xl font-black bg-rose-600 text-white border-2 border-black shadow hover:bg-rose-500 transition-all flex items-center mr-1.5 cursor-pointer";
        if (topIcon) topIcon.innerText = "⏸️";
        if (topLabel) topLabel.innerText = "일시정지";

        if (boardBtn) boardBtn.className = "px-3 py-1 text-xs rounded-xl font-black bg-rose-600 text-white border-2 border-black shadow hover:bg-rose-500 transition-all flex items-center cursor-pointer";
        if (boardIcon) boardIcon.innerText = "⏸️";
        if (boardLabel) boardLabel.innerText = "일시정지";

        if (stateBadge) {
            stateBadge.innerText = "🔥 배틀 진행 중";
            stateBadge.className = "px-2.5 py-0.5 text-[11px] font-black rounded-full bg-rose-950 text-rose-300 border border-rose-500/60";
        }
        if (arenaBanner) arenaBanner.classList.add('hidden');
    }
}

function startQuizSession() {
    safeRun('오디오 초기화', () => initAudio());
    const wasStarted = isQuizStarted;
    isQuizStarted = true;
    isQuizPaused = false;
    updateQuizControlUI();
    if (!roundLocked && !isTransitioningQuiz) {
        const startSec = (wasStarted && timer > 0 && timer < 20) ? timer : 20;
        startTimer(startSec);
        const statusElem = document.getElementById('pad-submit-status');
        if (statusElem) {
            statusElem.innerText = "🔥 배틀 진행 중! 정답 상자를 타격하세요!";
            statusElem.className = "text-[11px] text-amber-300 font-bold";
        }
    }
}

function pauseQuizSession() {
    if (!isQuizStarted || isQuizPaused) return;
    isQuizPaused = true;
    clearInterval(timerInterval);
    timerInterval = null;
    updateQuizControlUI();
    const statusElem = document.getElementById('pad-submit-status');
    if (statusElem) {
        statusElem.innerText = `⏸ 일시정지됨 (남은 시간 ${timer}초)`;
        statusElem.className = "text-[11px] text-amber-300 font-bold";
    }
}

function toggleQuizStartPause() {
    if (!isQuizStarted || isQuizPaused) {
        startQuizSession();
    } else {
        pauseQuizSession();
    }
}

// 현재 문제에 묶인 예약 실행 (문제가 바뀌면 자동 취소)
function scheduleRound(fn, ms) {
    const token = roundToken;
    const id = setTimeout(() => {
        pendingRoundTimers = pendingRoundTimers.filter(t => t !== id);
        if (token !== roundToken) return;
        try { fn(); } catch (e) { console.error("[워드나이츠] 예약 작업 오류:", e); }
    }, ms);
    pendingRoundTimers.push(id);
    return id;
}

function cancelRoundTimers() {
    pendingRoundTimers.forEach(id => clearTimeout(id));
    pendingRoundTimers = [];
}

// 연출 단계 하나가 실패해도 다음 단계는 계속 진행 (오류는 콘솔에 그대로 기록)
function safeRun(label, fn) {
    try { return fn(); } catch (e) { console.error(`[워드나이츠] ${label} 오류:`, e); }
}

function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// 4대 타깃 오브젝트 스타일 규격 (1번 상자, 2번 항아리, 3번 드럼통, 4번 보물상자)
const BOX_STYLES = [
    { icon: "📦", name: "1번 상자", color: "#38bdf8" },
    { icon: "🏺", name: "2번 항아리", color: "#f97316" },
    { icon: "🪵", name: "3번 나무통", color: "#38bdf8" },
    { icon: "🎁", name: "4번 보물상자", color: "#facc15" }
];

// 메인 전장(대형) 상자 배치 좌표 (좌측 쉘리 6~14%, 우측 보스 82~95%와 겹치지 않는 중앙 전투 구역)
const BOARD_BOX_POSITIONS = [
    { left: "22%", top: "10%" },  // 1번 (좌측 상단)
    { left: "54%", top: "10%" },  // 2번 (우측 상단)
    { left: "22%", top: "54%" },  // 3번 (좌측 하단)
    { left: "54%", top: "54%" }   // 4번 (우측 하단)
];

// 모바일 패드(소형) 상자 배치 좌표
const PAD_BOX_POSITIONS = [
    { left: "20%", top: "8%" },
    { left: "54%", top: "8%" },
    { left: "20%", top: "52%" },
    { left: "54%", top: "52%" }
];

// 선택지 개수에 맞는 상자 좌표 (2지선다 / 4지선다 / 5개 이상 예외 배치)
function getBoxPosition(idx, count, isPad) {
    if (count === 2) {
        return isPad
            ? (idx === 0 ? { left: "22%", top: "34%" } : { left: "54%", top: "34%" })
            : (idx === 0 ? { left: "25%", top: "36%" } : { left: "54%", top: "36%" });
    }
    const table = isPad ? PAD_BOX_POSITIONS : BOARD_BOX_POSITIONS;
    if (idx < table.length) return table[idx];
    const col = idx % 4, row = Math.floor(idx / 4);
    return { left: `${18 + col * 18}%`, top: `${10 + row * 30}%` };
}

// 맵 내에 타깃 파밍 상자 렌더링
function renderTargetBoxes() {
    const boardContainer = document.getElementById('board-target-boxes-container');
    const padContainer = document.getElementById('pad-target-boxes-container');

    if (boardContainer) boardContainer.innerHTML = '';
    if (padContainer) padContainer.innerHTML = '';

    if (!activeQuiz || !activeQuiz.options) return;

    const opts = activeQuiz.options;

    opts.forEach((opt, idx) => {
        const style = BOX_STYLES[idx % BOX_STYLES.length];

        // 1. 전자칠판 메인 전장 상자
        if (boardContainer) {
            const pos = getBoxPosition(idx, opts.length, false);
            const boxEl = document.createElement('div');
            boxEl.id = `board-box-${idx}`;
            boxEl.className = "target-farm-box";
            boxEl.style.left = pos.left;
            boxEl.style.top = pos.top;
            boxEl.title = `${idx + 1}번 상자 사격!`;
            boxEl.innerHTML = `
                <div class="box-label-tag" style="border-color: ${style.color};">
                    <span class="text-amber-300 font-black mr-1">${idx + 1}번</span>
                    <span class="text-white">${opt}</span>
                </div>
                <span class="box-body-icon">${style.icon}</span>
            `;
            boxEl.onclick = () => submitPadAnswer(idx);
            boardContainer.appendChild(boxEl);
        }

        // 2. 학생 스마트폰 패드 전장 상자
        if (padContainer) {
            const pos = getBoxPosition(idx, opts.length, true);
            const padBoxEl = document.createElement('div');
            padBoxEl.id = `pad-box-${idx}`;
            padBoxEl.className = "target-farm-box";
            padBoxEl.style.left = pos.left;
            padBoxEl.style.top = pos.top;
            padBoxEl.innerHTML = `
                <div class="box-label-tag text-xs sm:text-sm py-1 px-2.5" style="border-color: ${style.color}; max-width: 160px !important;">
                    <span class="text-amber-300 font-black mr-0.5">${idx + 1}.</span>${opt}
                </div>
                <span class="text-2xl sm:text-3xl filter drop-shadow">${style.icon}</span>
            `;
            padBoxEl.onclick = () => submitPadAnswer(idx);
            padContainer.appendChild(padBoxEl);
        }
    });
}

// 🔒 답 선택 후 상자·선택지 버튼 잠금 (chosenIdx는 강조 유지, null이면 전부 흐리게)
function setAnswerInputsLocked(chosenIdx) {
    document.querySelectorAll('#board-target-boxes-container .target-farm-box, #pad-target-boxes-container .target-farm-box')
        .forEach(el => {
            el.style.pointerEvents = 'none';
            el.style.cursor = 'default';
        });
    const padBtns = document.querySelectorAll('#pad-options-container button');
    padBtns.forEach((btn, idx) => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        if (idx !== chosenIdx) btn.style.opacity = '0.45';
    });
}

// ✅ 정답 상자 초록 광채로 공개
function revealCorrectBox() {
    if (!activeQuiz) return;
    const ans = activeQuiz.answer;
    [`board-box-${ans}`, `pad-box-${ans}`].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.filter = "drop-shadow(0 0 16px rgba(52, 211, 153, 0.95))";
    });
    const padBtns = document.querySelectorAll('#pad-options-container button');
    if (padBtns[ans]) {
        padBtns[ans].style.opacity = '1';
        padBtns[ans].style.outline = '3px solid #34d399';
    }
}

// 🏃💨 쉘리 실시간 이동 & 영거리 샷건 사격
function moveShellyToBoxAndShoot(boxIdx, isCorrect) {
    const shelly = document.getElementById('shelly-avatar');
    const padShelly = document.getElementById('pad-shelly-avatar');
    if (!activeQuiz || !activeQuiz.options) return;
    const count = activeQuiz.options.length;

    const approach = (pos) => {
        const l = parseFloat(pos.left), t = parseFloat(pos.top);
        return { left: (l > 50) ? `${l - 14}%` : `${l + 14}%`, top: `${t}%`, faceRight: l > 50 };
    };

    // 1. 상자 위치로 이동 대시 (전자칠판 / 학생 폰 각각의 좌표계 사용)
    if (shelly) {
        const a = approach(getBoxPosition(boxIdx, count, false));
        shelly.style.bottom = 'auto';
        shelly.style.left = a.left;
        shelly.style.top = a.top;
        shelly.style.transform = a.faceRight ? "scaleX(1)" : "scaleX(-1)";
    }
    if (padShelly) {
        const a = approach(getBoxPosition(boxIdx, count, true));
        padShelly.style.bottom = 'auto';
        padShelly.style.left = a.left;
        padShelly.style.top = a.top;
    }

    // 2. 0.35초 후 사격 모션 & 사운드
    scheduleRound(() => {
        safeRun('샷건 사운드', () => SoundFX.playBrawlShot());
        [shelly, padShelly].forEach(el => {
            if (!el) return;
            el.classList.add('living-shelly-shoot');
            setTimeout(() => el.classList.remove('living-shelly-shoot'), 350);
        });
        if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
    }, 350);
}

// ⏩ 다음 문제 전환 (자동 전환·수동 버튼·시간 초과 모두 이 함수 하나만 사용)
function proceedToNextQuiz() {
    if (isTransitioningQuiz) return;
    isTransitioningQuiz = true;
    roundLocked = true;
    cancelRoundTimers();          // 남아 있던 자동 전환 예약 취소 → 이중 전환 차단
    clearInterval(timerInterval);

    scheduleRound(() => {
        try {
            resetShellyToHome();
            const chapters = textbookLibrary[currentBookKey].chapters;
            if (bossHp <= 0) {
                endGame(true);
            } else if (currentChapterIdx < chapters.length - 1) {
                currentChapterIdx++;
                const chapSelect = document.getElementById('chapter-select');
                if (chapSelect) chapSelect.value = currentChapterIdx;
                activeQuiz = chapters[currentChapterIdx];
                loadCurrentQuiz(activeQuiz);
            } else {
                endGame(false);
            }
        } catch (e) {
            console.error("[워드나이츠] 다음 문제 전환 오류:", e);
            // 전환 실패 시에도 버튼으로 다시 시도할 수 있게 잠금 해제
            isTransitioningQuiz = false;
            roundLocked = false;
        }
    }, 300);
}

function resetShellyToHome() {
    const shelly = document.getElementById('shelly-avatar');
    const padShelly = document.getElementById('pad-shelly-avatar');
    if (shelly) {
        shelly.style.pointerEvents = 'none';   // 쉘리가 정답 상자 클릭을 가로채지 않도록
        shelly.style.bottom = 'auto';
        shelly.style.left = "4%";
        shelly.style.top = "45%";
        shelly.style.transform = "scaleX(1)";
    }
    if (padShelly) {
        padShelly.style.pointerEvents = 'none';
        padShelly.style.bottom = 'auto';
        padShelly.style.left = "4%";
        padShelly.style.top = "38%";
        padShelly.style.transform = "scaleX(1)";
    }
}

function handleTargetBoxDestruction(chosenIdx, isCorrect) {
    const field = document.getElementById('brawl-arena-field');
    const boardBox = document.getElementById(`board-box-${chosenIdx}`);
    const padBox = document.getElementById(`pad-box-${chosenIdx}`);

    if (isCorrect) {
        // ⭕ [정답 상자 파밍 성공!]
        if (boardBox) {
            boardBox.style.transform = "scale(0) rotate(180deg)";
            boardBox.style.opacity = "0";
            spawnSplinters(boardBox, field, BOX_STYLES[chosenIdx % BOX_STYLES.length].icon);
        }
        if (padBox) {
            padBox.style.transform = "scale(0)";
            padBox.style.opacity = "0";
        }

        // HP +1000 회복 (최대 5100)
        playerCurrentHp = Math.min(PLAYER_MAX_HP, playerCurrentHp + 1000);
        updateShellyHpUI();

        if (field) {
            const healPop = document.createElement('div');
            healPop.className = "hp-heal-float";
            healPop.innerText = "💚 +1000 HP RECOVER!";
            healPop.style.left = "120px";
            healPop.style.top = "30px";
            field.appendChild(healPop);
            setTimeout(() => healPop.remove(), 1100);
        }
    } else {
        // ❌ [오답 함정 상자 폭발!]
        if (boardBox) boardBox.style.animation = "shake 0.4s ease-in-out";

        if (field) {
            const trap = document.createElement('div');
            trap.className = "poison-trap-cloud";
            trap.innerText = "☠️";
            trap.style.left = boardBox ? boardBox.style.left : "50%";
            trap.style.top = boardBox ? boardBox.style.top : "50%";
            field.appendChild(trap);
            setTimeout(() => trap.remove(), 850);
        }

        // HP -1200 감점 (최소 500)
        playerCurrentHp = Math.max(500, playerCurrentHp - 1200);
        updateShellyHpUI();

        if (field) {
            const dmgPop = document.createElement('div');
            dmgPop.className = "hp-dmg-float";
            dmgPop.innerText = "💔 -1200 HP TRAP!";
            dmgPop.style.left = "120px";
            dmgPop.style.top = "30px";
            field.appendChild(dmgPop);
            setTimeout(() => dmgPop.remove(), 1100);
        }

        setTextById('board-boss-dialogue', '"크하하! 멍청하게 함정 상자를 건드렸구나!"');
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
}

// 쉘리 체력바 UI 실시간 갱신
function updateShellyHpUI() {
    const hpElem = document.getElementById('shelly-hp-val');
    if (!hpElem) return;
    hpElem.innerText = playerCurrentHp;
    hpElem.className = (playerCurrentHp <= 1500)
        ? "text-[11px] text-red-500 font-black animate-pulse"
        : "text-[11px] text-emerald-400 font-black";
}

// 상자 파편 비산 파티클 생성
function spawnSplinters(sourceEl, parentField, icon) {
    if (!sourceEl || !parentField) return;
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        s.className = "wood-splinter";
        s.innerText = icon === "🏺" ? "🧱" : "🪵";
        s.style.left = sourceEl.style.left;
        s.style.top = sourceEl.style.top;
        const angle = (i * 60) * (Math.PI / 180);
        const dist = 45 + Math.random() * 30;
        s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        parentField.appendChild(s);
        setTimeout(() => s.remove(), 700);
    }
}

// 🎯 정답 제출 처리
function submitPadAnswer(optionIdx) {
    safeRun('오디오 초기화', () => initAudio());
    if (roundLocked || isTransitioningQuiz || !activeQuiz) return;
    const student = students.find(s => s.id === currentStudentId);
    if (!student || student.answered) return;

    // 대기 상태에서 상자를 직접 클릭한 경우에도 세션을 즉시 활성화하여 다음 문제부터 연속 진행 보장
    if (!isQuizStarted || isQuizPaused) {
        isQuizStarted = true;
        isQuizPaused = false;
        updateQuizControlUI();
    }

    // 1. 즉시 잠금 + 타이머 정지 (연출 도중 시간 초과가 끼어들지 않게)
    roundLocked = true;
    clearInterval(timerInterval);

    student.answered = true;
    student.answerIdx = optionIdx;
    student.isCorrect = (optionIdx === activeQuiz.answer);
    const isCorrect = student.isCorrect;

    safeRun('입력 잠금', () => setAnswerInputsLocked(optionIdx));
    safeRun('제출 상태 표시', () => {
        const statusElem = document.getElementById('pad-submit-status');
        if (statusElem) {
            statusElem.innerText = `[${optionIdx + 1}번 선택 완료]`;
            statusElem.className = "text-[11px] text-emerald-400 font-bold animate-pulse";
        }
    });
    safeRun('학생 현황판', () => renderStudentGrid());
    safeRun('다른 학생 응답', () => simulateOtherStudents());

    // 2. 쉘리 이동 & 사격
    safeRun('쉘리 이동', () => moveShellyToBoxAndShoot(optionIdx, isCorrect));

    // 3. 0.4초 후 상자 파쇄 & HP 증감 & 정오답 피드백
    scheduleRound(() => {
        safeRun('상자 파쇄', () => handleTargetBoxDestruction(optionIdx, isCorrect));
        safeRun('정답 공개', () => revealCorrectBox());
        if (isCorrect) {
            safeRun('정답 사운드', () => SoundFX.playCorrect());
            safeRun('점수 반영', () => {
                student.score += 50;
                setTextById('pad-student-score', student.score);
                addScoreToStudentDB(student.name, 50);
            });
            safeRun('파워 큐브', () => grantPowerCube());
            safeRun('궁극기 충전', () => chargeSuperAttack());
            safeRun('보스 피격 연출', () => triggerBossHitReaction());
            safeRun('보스 대미지', () => applyDamageToBoss(activeQuiz.damage || 35, activeQuiz.dialogue || "크윽! 상자를 깨부수고 파워를 흡수하다니!"));
            safeRun('해설 표시', () => {
                const expEl = document.getElementById('pad-explanation-text');
                if (expEl) expEl.innerHTML = `<strong class="text-emerald-400 font-bold">정답입니다! 🎉 (HP +1000 파밍 성공!)</strong><br>${activeQuiz.explanation}`;
            });
        } else {
            safeRun('오답 사운드', () => SoundFX.playWrong());
            safeRun('보스 반격', () => bossCounterAttack());
            safeRun('해설 표시', () => {
                const expEl = document.getElementById('pad-explanation-text');
                if (expEl) expEl.innerHTML = `<strong class="text-rose-400 font-bold">오답 함정 폭발! 😢 (HP -1200 감점!)</strong><br>정답은 <span class="text-amber-300 font-bold">${activeQuiz.answer + 1}번</span>입니다.<br>${activeQuiz.explanation}`;
            });
        }
    }, 400);

    // 4. 2.6초 뒤 다음 문제 (문제가 그 사이 바뀌면 자동 무효)
    scheduleRound(proceedToNextQuiz, 2600);
}

// 다른 학생들 랜덤 응답 시뮬레이션 (현재 문제에만 반영)
function simulateOtherStudents() {
    students.forEach(s => {
        if (s.id !== currentStudentId && !s.answered) {
            scheduleRound(() => {
                if (s.answered) return;
                s.answered = true;
                const n = activeQuiz.options.length;
                s.answerIdx = (Math.random() < 0.8) ? activeQuiz.answer : Math.floor(Math.random() * n);
                s.isCorrect = (s.answerIdx === activeQuiz.answer);
                if (s.isCorrect) s.score += 50;
                renderStudentGrid();
                if (students.every(st => st.answered)) {
                    const badge = document.getElementById('all-answered-badge');
                    if (badge) badge.classList.remove('hidden');
                }
            }, Math.random() * 1200 + 300);
        }
    });
}

// 브롤 Web Audio 사운드 확장 (유실 → 복원)
SoundFX.playBrawlShot = function() {
    if (isMuted || !audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.22);
        gain.gain.setValueAtTime(0.5 * currentMasterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(masterGainNode);
        osc.start(now);
        osc.stop(now + 0.25);
    } catch(e) {}
};

SoundFX.playPowerCube = function() {
    if (isMuted || !audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.3 * currentMasterVolume, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.08);
            osc.connect(gain);
            gain.connect(masterGainNode);
            osc.start(now + i * 0.06);
            osc.stop(now + (i + 1) * 0.08);
        });
    } catch(e) {}
};

SoundFX.playSuperReady = function() {
    if (isMuted || !audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        [440, 554.37, 659.25, 880].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.4 * currentMasterVolume, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
            osc.connect(gain);
            gain.connect(masterGainNode);
            osc.start(now + i * 0.08);
            osc.stop(now + 0.45);
        });
    } catch(e) {}
};

SoundFX.playSuperBlast = function() {
    if (isMuted || !audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.6);
        gain.gain.setValueAtTime(0.7 * currentMasterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
        osc.connect(gain);
        gain.connect(masterGainNode);
        osc.start(now);
        osc.stop(now + 0.65);
    } catch(e) {}
};

// 상단 HUD(파워 큐브·궁극기·생존 브롤러)를 실제 상태값과 일치시킴
function syncBrawlHud() {
    setTextById('cube-count-val', playerPowerCubes);
    setTextById('pad-cube-count', playerPowerCubes);
    setTextById('shelly-cube-badge', `⚡ ${playerPowerCubes}`);
    setTextById('super-gauge-text', Math.round((superAttackCharge / 3) * 100) + "%");
    setTextById('brawl-alive-count', aliveBrawlers);
    setTextById('pad-alive-count', aliveBrawlers);
    const padSuper = document.getElementById('pad-super-btn');
    if (padSuper) padSuper.classList.toggle('ready', superAttackCharge >= 3);
}

// 보스 피격 넉백 & 생존자 카운트 연출 (유실 → 복원)
function triggerBossHitReaction() {
    ['boss-sprite-box', 'pad-boss-sprite'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('living-boss-hit');
            setTimeout(() => el.classList.remove('living-boss-hit'), 400);
        }
    });
    const stage = document.getElementById('brawl-battle-stage');
    if (stage) {
        stage.classList.add('boss-hit-knockback');
        setTimeout(() => stage.classList.remove('boss-hit-knockback'), 450);
    }
    if (aliveBrawlers > 2) aliveBrawlers--;
    syncBrawlHud();
}

// 파워 큐브 획득 연출 (유실 → 복원)
function grantPowerCube() {
    playerPowerCubes++;
    syncBrawlHud();
    SoundFX.playPowerCube();

    const field = document.getElementById('brawl-arena-field');
    if (field) {
        const flyingCube = document.createElement('div');
        flyingCube.className = "flying-power-cube";
        flyingCube.innerText = "⚡";
        field.appendChild(flyingCube);
        setTimeout(() => flyingCube.remove(), 900);

        scheduleRound(() => {
            const pop = document.createElement('div');
            pop.className = "cube-pop-text";
            pop.innerText = `⚡ +1 파워 큐브 획득! (공격력 x${(1 + playerPowerCubes * 0.2).toFixed(1)})`;
            pop.style.left = "30px";
            pop.style.top = "15px";
            field.appendChild(pop);
            setTimeout(() => pop.remove(), 1200);
        }, 450);
    }
}

// 궁극기 게이지 충전 (유실 → 복원)
function chargeSuperAttack() {
    if (superAttackCharge >= 3) return;
    superAttackCharge++;
    syncBrawlHud();
    if (superAttackCharge === 3) {
        SoundFX.playSuperReady();
        const statusElem = document.getElementById('pad-submit-status');
        if (statusElem) statusElem.innerText = "🔥 궁극기 준비 완료! 💀 버튼을 터치하세요!";
    }
}

// 💥 궁극기 슈퍼 샷건 폭풍 발사! (유실 → 복원, 경고창 대신 화면 안내)
function fireSuperAttack() {
    safeRun('오디오 초기화', () => initAudio());
    if (superAttackCharge < 3) {
        const statusElem = document.getElementById('pad-submit-status');
        if (statusElem) {
            statusElem.innerText = `⚡ 궁극기 게이지 ${Math.round((superAttackCharge / 3) * 100)}% — 정답 3번이면 발동!`;
            statusElem.className = "text-[11px] text-amber-300 font-bold";
        }
        return;
    }
    if (isTransitioningQuiz) return;

    superAttackCharge = 0;
    syncBrawlHud();
    SoundFX.playSuperBlast();

    const stage = document.getElementById('brawl-battle-stage');
    if (stage) {
        stage.style.filter = "brightness(2) contrast(1.5)";
        setTimeout(() => stage.style.filter = "none", 300);
    }

    const shelly = document.getElementById('shelly-avatar');
    if (shelly) {
        shelly.classList.add('living-shelly-shoot');
        setTimeout(() => shelly.classList.remove('living-shelly-shoot'), 450);
    }

    const field = document.getElementById('brawl-arena-field');
    if (field) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const bullet = document.createElement('div');
                bullet.className = "brawl-bullet";
                bullet.style.left = "80px";
                bullet.style.top = `${30 + i * 15}%`;
                field.appendChild(bullet);
                setTimeout(() => {
                    bullet.style.left = "calc(100% - 100px)";
                    bullet.style.transform = "scale(2.2)";
                }, 20);
                setTimeout(() => bullet.remove(), 250);
            }, i * 60);
        }
    }

    // 보스에게 초대형 궁극기 대미지 (-60 HP) — scheduleRound로 라운드 세대 검증 보장
    scheduleRound(() => {
        safeRun('궁극기 피격', () => {
            triggerBossHitReaction();
            applyDamageToBoss(60, "크아악! 쉘리의 슈퍼 샷건 폭풍에 산산조각 났다...!!");
        });
        // 궁극기로 보스가 쓰러지면 즉시 승리 처리
        if (bossHp <= 0 && !isTransitioningQuiz) {
            roundLocked = true;
            clearInterval(timerInterval);
            scheduleRound(proceedToNextQuiz, 1200);
        }
    }, 350);
}

// 쇼다운 독가스 경고 (남은 10초부터, 유실 → 복원)
function checkPoisonGas(remainingSeconds) {
    const overlay = document.getElementById('poison-gas-overlay');
    const badge = document.getElementById('poison-warning-badge');
    const danger = remainingSeconds <= 10 && remainingSeconds > 0;
    if (overlay) overlay.classList.toggle('danger', danger);
    if (badge) badge.classList.toggle('hidden', !danger);
}

function applyDamageToBoss(damage, dialogue) {
    bossHp = Math.max(0, bossHp - damage);
    const bar = document.getElementById('board-boss-hp-bar');
    if (bar) bar.style.width = bossHp + "%";
    setTextById('board-boss-hp-text', `${bossHp} / 100 HP`);
    setTextById('brawl-boss-hp-tag', `${bossHp}%`);
    setTextById('board-boss-dialogue', `"${dialogue}"`);

    const dmgElem = document.getElementById('board-floating-damage');
    if (!dmgElem) return;
    dmgElem.className = "absolute text-4xl text-amber-300 opacity-1 pointer-events-none transition-all duration-700 font-bold";
    dmgElem.innerText = `-${damage} HP!`;
    dmgElem.style.opacity = "1";
    dmgElem.style.transform = "translateY(-30px)";
    setTimeout(() => {
        dmgElem.style.opacity = "0";
        dmgElem.style.transform = "translateY(0)";
    }, 800);
}

function bossCounterAttack() {
    setTextById('board-boss-dialogue', '"푸하하! 어림없다! 문맥을 전혀 파악하지 못했구나!"');
    const dmgElem = document.getElementById('board-floating-damage');
    if (!dmgElem) return;
    dmgElem.className = "absolute text-2xl text-rose-400 opacity-1 pointer-events-none transition-all duration-700 font-bold";
    dmgElem.innerText = `🛡️ BLOCK! 0 DMG`;
    dmgElem.style.opacity = "1";
    dmgElem.style.transform = "translateY(-20px)";
    setTimeout(() => {
        dmgElem.style.opacity = "0";
        dmgElem.style.transform = "translateY(0)";
    }, 800);
}

function startTimer(initialSeconds = 20) {
    clearInterval(timerInterval);
    timerInterval = null;
    timer = (typeof initialSeconds === 'number' && initialSeconds > 0) ? initialSeconds : 20;
    const token = roundToken;
    updateTimerDisplay();
    checkPoisonGas(timer);
    if (!isQuizStarted || isQuizPaused) return;
    safeRun('타이머 사운드', () => SoundFX.playTick(timer));

    const intervalId = setInterval(() => {
        if (token !== roundToken || !isQuizStarted || isQuizPaused) { clearInterval(intervalId); return; }
        timer--;
        safeRun('타이머 표시', () => updateTimerDisplay());
        safeRun('독가스 경고', () => checkPoisonGas(timer));
        safeRun('타이머 사운드', () => SoundFX.playTick(timer));

        if (timer <= 0) {
            clearInterval(intervalId);
            handleTimeOut();
        }
    }, 1000);
    timerInterval = intervalId;
}

function updateTimerDisplay() {
    const shown = Math.max(0, timer);
    const timerText = document.getElementById('board-timer-text');
    if (timerText) timerText.innerText = shown;
    const pct = (shown / 20) * 100;
    const bar = document.getElementById('board-timer-bar');
    if (!bar) return;
    bar.style.width = pct + "%";

    if (shown <= 5) {
        bar.className = "bg-rose-500 h-full transition-all duration-1000";
        if (timerText) timerText.classList.add('animate-urgent');
    } else {
        bar.className = "bg-gradient-to-r from-amber-400 to-yellow-300 h-full transition-all duration-1000";
        if (timerText) timerText.classList.remove('animate-urgent');
    }
}

// ⏰ 시간 초과: 입력 잠금 → 정답 공개 → 자동으로 다음 문제
function handleTimeOut() {
    if (roundLocked || isTransitioningQuiz || !activeQuiz) return;
    roundLocked = true;
    clearInterval(timerInterval);

    safeRun('입력 잠금', () => setAnswerInputsLocked(null));
    safeRun('시간 초과 연출', () => { SoundFX.playWrong(); bossCounterAttack(); });
    safeRun('정답 공개', () => revealCorrectBox());
    safeRun('시간 초과 안내', () => {
        const statusElem = document.getElementById('pad-submit-status');
        if (statusElem) {
            statusElem.innerText = "⏰ 시간 초과!";
            statusElem.className = "text-[11px] text-rose-400 font-bold";
        }
        const ans = activeQuiz.answer;
        const expEl = document.getElementById('pad-explanation-text');
        if (expEl) expEl.innerHTML = `<strong class="text-rose-400 font-bold">⏰ 시간 초과!</strong><br>정답은 <span class="text-amber-300 font-bold">${ans + 1}번 (${activeQuiz.options[ans]})</span>입니다.<br>${activeQuiz.explanation}`;
    });

    scheduleRound(proceedToNextQuiz, 2600);
}

function changeStudentId(id) {
    currentStudentId = parseInt(id);
    const student = students.find(s => s.id === currentStudentId);
    if (student) {
        setTextById('pad-student-score', student.score);
        setTextById('pad-student-avatar', student.role.split(' ')[0]);
    }
    safeRun('오디오 초기화', () => initAudio());
}

// 학생 패드 선택 목록을 현재 반 명단으로 갱신 (수업반 변경 시 호출, 유실 → 신규 구현)
function renderPadStudentSelector() {
    const sel = document.getElementById('student-id-select');
    if (!sel) return;
    sel.innerHTML = students.map((s, i) => {
        const roleName = (s.role || '').split(' ').slice(1).join(' ');
        return `<option value="${s.id}">${roleName} ${s.name} (${i + 1}번 패드)</option>`;
    }).join('');
    if (!students.some(s => s.id === currentStudentId) && students[0]) currentStudentId = students[0].id;
    sel.value = String(currentStudentId);
    const student = students.find(s => s.id === currentStudentId);
    if (student) {
        setTextById('pad-student-score', student.score);
        setTextById('pad-student-avatar', student.role.split(' ')[0]);
    }
}

// QR 모달: 로컬 서버 IP 프리셋 / 직접 입력 (유실 → 복원)
function setHostIp(type) {
    const input = document.getElementById('custom-host-ip');
    if (!input) return;
    if (type === 'my-pc') {
        input.value = "192.168.10.223:8080";
    } else if (type === 'flip') {
        input.value = "192.168.0.100:8080";
    }
    applyCustomIp();
}

function applyCustomIp() {
    const input = document.getElementById('custom-host-ip');
    if (input && input.value.trim()) {
        localStorage.setItem('hanuri_game_host_ip', input.value.trim());
        updateQrTargetUrl();
    }
}

// ----------------------------------------------------
// 📦 보상 상자 오픈 로직
// ----------------------------------------------------
function endGame(isVictory) {
    cancelRoundTimers();
    roundLocked = true;
    isTransitioningQuiz = true;   // 결과 화면에서는 '다음 문제' 버튼 무시 (resetGame 시 해제)
    isQuizStarted = false;
    isQuizPaused = false;
    clearInterval(timerInterval);
    timerInterval = null;
    updateQuizControlUI();
    if (isVictory) {
        triggerBrawlBox();
    } else {
        safeRun('패배 사운드', () => SoundFX.playWrong());
        document.getElementById('defeat-modal').classList.remove('hidden');
    }
}

// ----------------------------------------------------
// 🌟 [브롤스타즈 공식 5단계 등급 상승 스타드롭 연출 엔진]
// ----------------------------------------------------
function triggerBrawlBox() {
    boxTapsRemaining = 3;
    document.getElementById('box-tap-count').innerText = boxTapsRemaining;
    document.getElementById('brawl-box-container').classList.remove('hidden');
    document.getElementById('brawl-reward-card').classList.add('hidden');
    document.getElementById('stardrop-glow').classList.add('hidden');

    // 1단계: 희귀 스타드롭 (초록/블루)
    updateStardropStage(1);

    document.getElementById('brawl-box-modal').classList.remove('hidden');
}

function updateStardropStage(stage) {
    const badge = document.getElementById('stardrop-tier-badge');
    const tierName = document.getElementById('stardrop-tier-name');
    const boxSprite = document.getElementById('box-sprite');
    const glow = document.getElementById('stardrop-glow');

    if (stage === 1) {
        // 희귀 (Rare)
        badge.className = "px-6 py-2 rounded-full border-3 border-black shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white transition-all duration-300";
        tierName.innerText = "희귀 스타드롭";
        boxSprite.innerText = "⭐";
        boxSprite.className = "text-9xl sm:text-[130px] animate-stardrop-float filter drop-shadow-[0_15px_30px_rgba(59,130,246,0.7)] transition-all";
        glow.classList.add('hidden');
    } else if (stage === 2) {
        // 초희귀 (Super Rare)
        badge.className = "px-6 py-2 rounded-full border-3 border-black shadow-[0_0_25px_rgba(168,85,247,0.8)] mb-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white transition-all duration-300";
        tierName.innerText = "초희귀 스타드롭";
        boxSprite.innerText = "🔮";
        boxSprite.className = "text-9xl sm:text-[130px] animate-bounce filter drop-shadow-[0_20px_40px_rgba(168,85,247,0.8)] transition-all";
    } else if (stage === 3) {
        // 신화 (Mythic)
        badge.className = "px-6 py-2 rounded-full border-3 border-black shadow-[0_0_30px_rgba(244,63,94,0.9)] mb-4 bg-gradient-to-r from-rose-600 to-red-500 text-white transition-all duration-300";
        tierName.innerText = "신화 스타드롭 !!";
        boxSprite.innerText = "💎";
        boxSprite.className = "text-9xl sm:text-[130px] animate-spin-slow filter drop-shadow-[0_20px_45px_rgba(244,63,94,0.9)] transition-all";
    } else if (stage === 4) {
        // 전설 (Legendary) - 무지개 회전 광채 폭발!
        badge.className = "px-7 py-2.5 rounded-full border-3 border-black shadow-[0_0_35px_rgba(250,204,21,1)] mb-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black transition-all duration-300 animate-pulse";
        tierName.innerText = "★ 전설 스타드롭 (LEGENDARY) ★";
        boxSprite.innerText = "🌟";
        boxSprite.className = "text-9xl sm:text-[140px] animate-bounce filter drop-shadow-[0_25px_50px_rgba(250,204,21,1)] transition-all";
        glow.classList.remove('hidden');
    }
}

function openBoxStep() {
    if (boxTapsRemaining <= 0) return;   // 이미 열린 상자 연타 방지
    boxTapsRemaining--;

    if (boxTapsRemaining === 2) {
        safeRun('상자 사운드', () => SoundFX.playBoxTap(2));
        updateStardropStage(2); // 초희귀 승급!
        document.getElementById('box-tap-count').innerText = 2;
    } else if (boxTapsRemaining === 1) {
        safeRun('상자 사운드', () => SoundFX.playBoxTap(1));
        updateStardropStage(3); // 신화 승급!
        document.getElementById('box-tap-count').innerText = 1;
    } else {
        // 전설 등급 폭발 & 오픈!
        updateStardropStage(4);
        safeRun('전설 사운드', () => SoundFX.playLegendaryOpen());

        setTimeout(() => {
            document.getElementById('brawl-box-container').classList.add('hidden');
            document.getElementById('stardrop-glow').classList.add('hidden');
            document.getElementById('brawl-reward-card').classList.remove('hidden');

            const wordList = document.getElementById('reward-word-list');
            const chapters = textbookLibrary[currentBookKey].chapters;
            wordList.innerHTML = chapters.map((c, idx) => `
                <div class="p-3 rounded-2xl bg-slate-900/90 border-2 border-indigo-500/40 shadow-lg hover:border-amber-400 transition-all cursor-pointer group" onclick="toggleWordDetail(${idx})">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow">
                                ★
                            </span>
                            <span class="font-black text-amber-300 text-base tracking-wide">${formatRewardTitle(c, idx)}</span>
                            <span class="text-[10px] text-slate-400 font-mono">(${c.hanja || '어휘'})</span>
                        </div>
                        <span class="text-[11px] text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800">
                            ${c.category}
                        </span>
                    </div>

                    <!-- 💡 아이들이 빵 터지는 어휘 유래 비법 스토리 & 예문 -->
                    <div id="word-detail-${idx}" class="mt-2.5 pt-2 border-t border-slate-800 text-xs text-slate-200 space-y-1">
                        <p class="text-amber-200 font-bold leading-relaxed">
                            ${c.funOrigin || c.explanation || ''}
                        </p>
                        <p class="text-[11px] text-slate-400 italic">
                            📝 예문: "${c.example || c.question || ''}"
                        </p>
                    </div>
                </div>
            `).join('');
        }, 500);
    }
}

// 보상 카드 제목 포맷터 (DADA1_01_01 같은 내부 코드 대신 실제 어휘/문항명 표시)
function formatRewardTitle(c, idx) {
    const w = (c.word || '').trim();
    if (w && !/^[A-Z0-9_]+$/i.test(w)) return w;
    const quoted = (c.explanation || '').match(/'([^']{1,12})'/g);
    if (quoted && quoted.length > 0) {
        const uniq = [...new Set(quoted.map(q => q.replace(/'/g, '')))];
        return uniq.slice(0, 3).join(' · ');
    }
    return c.workTitle || c.name || (c.options && c.options[c.answer]) || `${idx + 1}번 어휘`;
}

// 보상 단어 카드 탭 → 유래·예문 접기/펼치기 (신규 구현)
function toggleWordDetail(idx) {
    const detail = document.getElementById(`word-detail-${idx}`);
    if (detail) detail.classList.toggle('hidden');
}

function closeBoxAndReset() {
    document.getElementById('brawl-box-modal').classList.add('hidden');
    resetGame();
}

// 전투 수치·모달 전체 초기화 (새 게임 / 새 교재 전환 공용)
function resetBattleState() {
    cancelRoundTimers();
    clearInterval(timerInterval);
    timerInterval = null;
    roundLocked = false;
    isTransitioningQuiz = false;
    isQuizStarted = false;
    isQuizPaused = false;

    const defeatModal = document.getElementById('defeat-modal');
    if (defeatModal) defeatModal.classList.add('hidden');
    const boxModal = document.getElementById('brawl-box-modal');
    if (boxModal) boxModal.classList.add('hidden');

    bossHp = 100;
    const bar = document.getElementById('board-boss-hp-bar');
    if (bar) bar.style.width = "100%";
    setTextById('board-boss-hp-text', "100 / 100 HP");
    setTextById('brawl-boss-hp-tag', "100%");

    playerCurrentHp = PLAYER_MAX_HP;
    playerPowerCubes = 0;
    superAttackCharge = 0;
    aliveBrawlers = 10;
    timer = 20;
    updateTimerDisplay();
    checkPoisonGas(20);
    updateShellyHpUI();
    syncBrawlHud();
    updateQuizControlUI();
}

function resetGame() {
    resetBattleState();
    currentChapterIdx = 0;
    const chapSelect = document.getElementById('chapter-select');
    if (chapSelect) chapSelect.value = "0";
    activeQuiz = textbookLibrary[currentBookKey].chapters[0];
    loadCurrentQuiz(activeQuiz);
}

// ----------------------------------------------------
// 🚀 URL 파라미터 감지 및 자동 뷰 모드 설정
// ----------------------------------------------------
window.addEventListener('click', () => { safeRun('오디오 초기화', () => initAudio()); }, { once: true });
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');

    if (role === 'board') {
        switchViewMode('board');
    } else if (role === 'student') {
        switchViewMode('student');
    } else {
        switchViewMode('twin');
    }

    syncBrawlHud();
    renderPadStudentSelector();
    loadCurrentQuiz(activeQuiz);
};
