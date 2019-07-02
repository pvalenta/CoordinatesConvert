/*/

Zdroj: http://martin.hinner.info/geo/

/*/

function setzeroes(form)
{
 form.latitude.value="";  form.longitude.value=""; form.vyska.value=""; 

   document.getElementById("mapycz").innerHTML = '';
   document.getElementById("googlemaps").innerHTML = '';
}

function jtsk_to_wgs(X,Y,H)
{
  var coord = {wgs84_latitude:"", wgs84_longitude:"", lat: 0, lon: 0, vyska: 0};
 
  /* Přepočet vstupích údajů - vychazi z nejakeho skriptu, ktery jsem nasel na Internetu - nejsem autorem prepoctu. */

  /*Vypocet zemepisnych souradnic z rovinnych souradnic*/
  a=6377397.15508; 
  e=0.081696831215303;
  n=0.97992470462083; 
  konst_u_ro=12310230.12797036;
  sinUQ=0.863499969506341; 
  cosUQ=0.504348889819882;
  sinVQ=0.420215144586493; 
  cosVQ=0.907424504992097;
  alfa=1.000597498371542; 
  k=1.003419163966575;
  ro=Math.sqrt(X*X+Y*Y);
  epsilon=2*Math.atan(Y/(ro+X));
  D=epsilon/n; 
  S=2*Math.atan(Math.exp(1/n*Math.log(konst_u_ro/ro)))-Math.PI/2;
  sinS=Math.sin(S);
  cosS=Math.cos(S);
  sinU=sinUQ*sinS-cosUQ*cosS*Math.cos(D);
  cosU=Math.sqrt(1-sinU*sinU);
  sinDV=Math.sin(D)*cosS/cosU; 
  cosDV=Math.sqrt(1-sinDV*sinDV);
  sinV=sinVQ*cosDV-cosVQ*sinDV; 
  cosV=cosVQ*cosDV+sinVQ*sinDV;
  Ljtsk=2*Math.atan(sinV/(1+cosV))/alfa;
  t=Math.exp(2/alfa*Math.log((1+sinU)/cosU/k));
  pom=(t-1)/(t+1);
  do {
   sinB=pom;
   pom=t*Math.exp(e*Math.log((1+e*sinB)/(1-e*sinB))); 
   pom=(pom-1)/(pom+1);
  } while (Math.abs(pom-sinB)>1e-15);

   Bjtsk=Math.atan(pom/Math.sqrt(1-pom*pom));


/* Pravoúhlé souřadnice ve S-JTSK */   
   a=6377397.15508; f_1=299.152812853;
   e2=1-(1-1/f_1)*(1-1/f_1); ro=a/Math.sqrt(1-e2*Math.sin(Bjtsk)*Math.sin(Bjtsk));
   x=(ro+H)*Math.cos(Bjtsk)*Math.cos(Ljtsk);  
   y=(ro+H)*Math.cos(Bjtsk)*Math.sin(Ljtsk);  
   z=((1-e2)*ro+H)*Math.sin(Bjtsk);

/* Pravoúhlé souřadnice v WGS-84*/
   dx=570.69; dy=85.69; dz=462.84; 
   wz=-5.2611/3600*Math.PI/180;wy=-1.58676/3600*Math.PI/180;wx=-4.99821/3600*Math.PI/180; m=3.543e-6; 
   xn=dx+(1+m)*(x+wz*y-wy*z); yn=dy+(1+m)*(-wz*x+y+wx*z); zn=dz+(1+m)*(wy*x-wx*y+z);

/* Geodetické souřadnice v systému WGS-84*/
   a=6378137.0; f_1=298.257223563;
   a_b=f_1/(f_1-1); p=Math.sqrt(xn*xn+yn*yn); e2=1-(1-1/f_1)*(1-1/f_1);
   theta=Math.atan(zn*a_b/p); st=Math.sin(theta); ct=Math.cos(theta);
   t=(zn+e2*a_b*a*st*st*st)/(p-e2*a*ct*ct*ct);
   B=Math.atan(t);  L=2*Math.atan(yn/(p+xn));  H=Math.sqrt(1+t*t)*(p-a/Math.sqrt(1+(1-e2)*t*t));

/* Formát výstupních hodnot */   

   B=B/Math.PI*180;  

   coord.lat = B;
   latitude="N"; if (B<0) {B=-B; latitude="S";};

   st_sirky=Math.floor(B);  B=(B-st_sirky)*60; min_sirky=Math.floor(B);
   B=(B-min_sirky)*60; vt_sirky=Math.round(B*1000)/1000;
   latitude=st_sirky+"°"+min_sirky+"'"+vt_sirky+latitude;
   coord.wgs84_latitude = latitude;

   L=L/Math.PI*180;  
   coord.lon = L;
   longitude="E"; if (L<0) {L=-L; longitude="W";};

   st_delky=Math.floor(L);  L=(L-st_delky)*60; min_delky=Math.floor(L);
   L=(L-min_delky)*60; vt_delky=Math.round(L*1000)/1000;
   longitude=st_delky+"°"+min_delky+"'"+vt_delky+longitude;
   coord.wgs84_longitude = longitude;

   coord.vyska=Math.round((H)*100)/100;

  return coord;
}

function calc(form) {

   X=parseFloat(form.X.value);
   Y=parseFloat(form.Y.value);
   H=parseFloat(form.nadmor.value)+45;

   // negativni Krovak
   if (X < 0 && Y < 0) {X=-X; Y=-Y;}

   coord = jtsk_to_wgs(X,Y,H);

   document.getElementById("mapycz").innerHTML = '<a href="http://mapy.cz/zakladni?q='+encodeURI(coord.wgs84_latitude+" "+coord.wgs84_longitude)+'" target="_new">Odkaz mapy.cz</a>';
   document.getElementById("googlemaps").innerHTML = '<a href="https://www.google.cz/maps/place/'+encodeURI(coord.wgs84_latitude+" "+coord.wgs84_longitude)+'" target="_new">Odkaz maps.google.com</a>';

   form.latitude.value=coord.wgs84_latitude;  
   form.longitude.value=coord.wgs84_longitude;
   form.vyska.value=coord.vyska + " m";

}

var MapCoords = Array();

function calcall() {
  var lines = document.getElementById('csv').value.split("\n");
  var res = "";

  MapCoords = Array();

  for(var i = 0;i < lines.length;i++){
     line = lines[i].replace(/\s{2,}/g, ' ').trim();
     if (line != "") { 
       coords = line.split(" ");

       X = parseFloat(coords[0]);
       Y = parseFloat(coords[1]);
       // negativni Krovak
       if (X < 0 && Y < 0) {X=-X; Y=-Y;}
       if (Y > X) {q=X; X=Y;Y=q;};

       coord = jtsk_to_wgs(X,Y,245.0);
       MapCoords.push(Array(coord.lat,coord.lon));

       res = res + "<tr><td>"+X+"<td>"+Y+"<td>"+coord.wgs84_latitude+"<td>"+coord.wgs84_longitude+"<td>"+coord.lat+"<td>"+coord.lon+"</td></tr>";
     }
  }
  document.getElementById("csvres").innerHTML = "<table border=1>"+res+'</table><a href="javascript:mapit();">Google mapa</a>'
   + ' - <a href="javascript:seznam_mapit(SMap.DEF_OPHOTO);">Mapy.cz - ortophoto</a> '
   + ' - <a href="javascript:seznam_mapit(SMap.DEF_OPHOTO0406);">Mapy.cz - ortophoto 0406</a> '
   + ' - <a href="javascript:seznam_mapit(SMap.DEF_OPHOTO0203);">Mapy.cz - ortophoto 0203</a>' ;

}


var map;

function mapit() {

  var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(MapCoords[0][0], MapCoords[0][1]),
    mapTypeId: google.maps.MapTypeId.HYBRID
  };


//  alert(MapCoords);


 var bermudaTriangle;

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      

  // Define the LatLng coordinates for the polygon.
  var triangleCoords = Array();

  for (i=0;i<MapCoords.length;i++)
    triangleCoords.push(new google.maps.LatLng(MapCoords[i][0],MapCoords[i][1]));

  // Construct the polygon.
  bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });

  bermudaTriangle.setMap(map);

}

function seznam_mapit(layer) {
var souradnice = [];

  for (i=0;i<MapCoords.length;i++) {
    var c = SMap.Coords.fromWGS84(MapCoords[i][1],MapCoords[i][0]);
    souradnice.push(c);
   }


var m = new SMap(JAK.gel("map-canvas"));
m.addControl(new SMap.Control.Sync()); /* Aby mapa reagovala na změnu velikosti průhledu */


m.addDefaultLayer(layer).enable();

var mouse = new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM); /* Ovládání myší */
m.addControl(mouse); 
m.addDefaultControls();

var vrstva = new SMap.Layer.Geometry();     /* Geometrická vrstva */
m.addLayer(vrstva);                          /* Přidat ji do mapy */
vrstva.enable();                         /* A povolit */
var options = {
    color: "blue",
    opacity: 0.3,
    outlineColor: "blue",
    outlineOpacity: 0.7,
    outlineWidth: 4,
    curvature: 0
};
var polygon = new SMap.Geometry(SMap.GEOMETRY_POLYGON, null, souradnice, options);    
vrstva.addGeometry(polygon);

var cz = m.computeCenterZoom(souradnice); /* Spočítat pozici mapy tak, aby byl vidět celý mnohoúhelník */
m.setCenterZoom(souradnice[0], 16);

}

function prubeh(form) {
   X1=parseFloat(form.X1.value);
   Y1=parseFloat(form.Y1.value);
   X2=parseFloat(form.X2.value);
   Y2=parseFloat(form.Y2.value);
   step=parseFloat(form.step.value);

   dx= (X2-X1);
   dy= (Y2-Y1);
   dsquare = dx*dx + dy*dy;
   length = Math.sqrt(dsquare);

   text = "Prubeh z "+Y1+" "+X1+" do "+Y2+" "+X1+" po " + step + "m, delka "+length+" m";

   text = text + "<table border=1>";
   ll = 0;
   n = -1;
   do {
     n++;
     ll = n*step;
     k = Math.sqrt(ll*ll/dsquare);
     x = X1 + (k*dx);
     y = Y1 + (k*dy);
     x = Math.round(x*1000)/1000;
     y = Math.round(y*1000)/1000;
     text = text + "<tr><td>"+n+". <td>"+ ll + "m <td>  "+y+"<td> "+x;
   } while (ll < length);

   text = text + "</table>";

   document.getElementById("prubehres").innerHTML = text;
}
