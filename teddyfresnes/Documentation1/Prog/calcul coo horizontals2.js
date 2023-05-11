<!--
// Equatorial to horizontal coordinates converter (Xavier Jubier: http://xjubier.free.fr/)
//
// Modifications:
// 2004-06-10   Xavier Jubier   Added language parameter to compute()
//

var myLanguage = "en";
var PI = Math.PI;
var PIx2 = 2.0 * Math.PI;
var D2R = Math.PI / 180.0;
var R2D = 180.0 / Math.PI;
var HR = Math.PI / 12.0;
var K1 = 15.0 * D2R * 1.002737909350795;
var alt, azm;


// Compute altitude and azimuth
function compute( language )
{
  if ( language != undefined )
    myLanguage = language;

  var rah = parseInt(document.getElementById("rah").value, 10);
  var ram = parseInt(document.getElementById("ram").value, 10);
  var ras = parseFloat(document.getElementById("ras").value.replace(/\,/, '.'));
  var decd = parseInt(document.getElementById("decd").value, 10);
  var decm = parseInt(document.getElementById("decm").value, 10);
  var decs = parseFloat(document.getElementById("decs").value.replace(/\,/, '.'));
  if ( isNaN(decd) || (Math.abs(decd) >= 90) || isNaN(decm) || (decm < 0) || (decm >= 60) || isNaN(rah) || (rah < 0) || (rah >= 24) || isNaN(ram) || (ram < 0) || (ram >= 60) )
  {
    document.getElementById("rah").focus();
    document.getElementById("rah").select();
    if (language == "fr")
      alert("Donn\xE9es object en A.D. et/ou D\xE9c erron\xE9es!");
    else
      alert("Invalid Object RA and/or Dec data!");
    return;
  }

  var latd = parseInt(document.getElementById("latd").value, 10);
  var latm = parseFloat(document.getElementById("latm").value.replace(/\,/, '.'));
  var latx = parseInt(document.getElementById("latx").value, 10);
  var lond = parseInt(document.getElementById("lond").value, 10);
  var lonm = parseFloat(document.getElementById("lonm").value.replace(/\,/, '.'));
  var lonx = parseInt(document.getElementById("lonx").value, 10);
  if ( isNaN(latd) || (Math.abs(latd) >= 90) || isNaN(latm) || (latm < 0) || (latm >= 60) || isNaN(lond) || (Math.abs(lond) >= 180) || isNaN(lonm) || (lonm < 0) || (lonm >= 60) )
  {
    document.getElementById("latd").focus();
    document.getElementById("latd").select();
    if (language == "fr")
      alert("Coordonn\xE9es de l\u2019observateur erron\xE9es!");
    else
      alert("Invalid Observer data!");
    return;
  }

  var year = parseInt(document.getElementById("year").value, 10);
  var month = parseInt(document.getElementById("month").value, 10);
  var day = parseInt(document.getElementById("day").value, 10);
  var hour = parseInt(document.getElementById("hour").value, 10);
  var minute = parseInt(document.getElementById("minute").value, 10);
  var second = parseFloat(document.getElementById("second").value.replace(/\,/, '.'));
  var now = new Date(year, month - 1, day, hour, minute, second);
  if ( isNaN(now.getTime()) || (month < 1) || (month > 12) || (day < 1) || (day > 31) || (hour < 0) || (hour >= 24) || (minute < 0) || (minute >= 60) || (second < 0) || (second >= 60) )
  {
    document.getElementById("year").focus();
    document.getElementById("year").select();
    if (language == "fr")
      alert("Donn\xE9es date et/ou heure erron\xE9es!");
    else
      alert("Invalid Date/Time data!");
    return;
  }

  var obj = new Object();
  obj.ra = ra2real(rah, ram, ras);
  obj.dec = dms2real(decd, decm, decs);
  if (document.getElementById("epoch_j2000").checked == true)	// Epoch J2000
  	ConvertJ2000ToJNow(year, month, day, hour, minute, second, obj);
  else
  {
    obj.raJNow = obj.ra;
    obj.decJNow = obj.dec;
  }
  var lat = dms2real(latx * latd, latm, 0);
  var lon = dms2real(lonx * lond, lonm, 0);

   // Geocentric horizontal coordinates (Alt/Az)
  eq_to_ho(now, obj, lat, lon);
  document.getElementById("alt").innerHTML = fixed2(alt) + "&deg;";
  document.getElementById("azm").innerHTML = fixed2(azm) + "&deg;";
  document.getElementById("altr").innerHTML = fixed2(alt + refraction(alt)) + "&deg;";
  document.getElementById("azmr").innerHTML = fixed2(azm) + "&deg;";

   // Need the distance of the object from Earth
  if (language == "fr")
  {
    document.getElementById("altt").innerHTML = "non disponible";
    document.getElementById("azmt").innerHTML = "non disponible";
  }
  else
  {
    document.getElementById("altt").innerHTML = "n/a";
    document.getElementById("azmt").innerHTML = "n/a";
  }
//  document.getElementById("altt").innerHTML = fixed2(geocentric2topocentricAltAz(alt, distEarthRadii)) + "&deg;";
  var true_alt = geocentric2topocentricAltAz(alt, 1e10);
  document.getElementById("altt").innerHTML = fixed2(true_alt + refraction(true_alt)) + "&deg;";
  document.getElementById("azmt").innerHTML = fixed2(azm) + "&deg;";
}

// Handle a location modification
function modifiedCoordinates( which, language )
{
  var ddStr;

  if ( which == 1 ) // Latitude
  {
    if ( document.getElementById("Lat_dd") )
    {
      ddStr = parseInt("0" + document.getElementById("latd").value, 10);
      ddStr += parseFloat((document.getElementById("latm").value == "") ? "0.0" : document.getElementById("latm").value.replace(/\,/, '.')) / 60.0;
      if ( ! isNaN(ddStr) )
      {
        ddStr = Math.abs(ddStr);
        if ( ddStr > 90.0 )
        {
          if (myLanguage == "fr")
            alert("Saisissez une latitude comprise entre 0 et 90 degr\xE9s, Nord ou Sud.");
          else
            alert("Please enter a latitude between 0 and 90 degrees, North or South.");
          document.getElementById("latd").focus();
          document.getElementById("latd").select();
          return false;
        }
        if ( document.getElementById("latx").selectedIndex == 1 ) // South
          ddStr = -ddStr;
        ddStr = ddStr.toFixed(5);
        if (language == "fr")
          ddStr = ddStr.replace(/\./, ',');
        document.getElementById("Lat_dd").innerHTML = "&nbsp;&mdash;&gt;&nbsp;" + ddStr + "&deg;";
      }
      else
        document.getElementById("Lat_dd").innerHTML = "";
    }
  }
  else // Longitude
  {
    if ( document.getElementById("Lon_dd") )
    {
      ddStr = parseInt("0" + document.getElementById("lond").value, 10);
      ddStr += parseFloat((document.getElementById("lonm").value == "") ? "0.0" : document.getElementById("lonm").value.replace(/\,/, '.')) / 60.0;
      if ( ! isNaN(ddStr) )
      {
        ddStr = Math.abs(ddStr);
        if ( ddStr > 180.0 )
        {
          if (myLanguage == "fr")
            alert("Saisissez une longitude comprise entre 0 et 180 degr\xE9s, Est ou Ouest.");
          else
            alert("Please enter a longitude between 0 and 180 degrees, East or West.");
          document.getElementById("lond").focus();
          document.getElementById("lond").select();
          return false;
        }
        if ( document.getElementById("lonx").selectedIndex == 1 ) // West
          ddStr = -ddStr;
        ddStr = ddStr.toFixed(5);
        if (language == "fr")
          ddStr = ddStr.replace(/\./, ',');
        document.getElementById("Lon_dd").innerHTML = "&nbsp;&mdash;&gt;&nbsp;" + ddStr + "&deg;";
      }
      else
        document.getElementById("Lon_dd").innerHTML = "";
    }
  }
}

// Compute geocentric horizontal coordinates from ra, dec, lat, lon, and utc
function eq_to_ho( utc, obj, lat, lon )
{
   // Hour angle in degrees
  var ha = mean_sidereal_time(utc, lon) - obj.raJNow;
  ha = rev(ha);

  ha *= D2R;
  obj.decJNow *= D2R;
  lat *= D2R;

   // Altitude in radians
  var sin_alt = Math.sin(obj.decJNow) * Math.sin(lat) + Math.cos(obj.decJNow) * Math.cos(lat) * Math.cos(ha);
  alt = Math.asin(sin_alt);

   // Azimuth in radians (divide by zero error at poles or if alt = 90 deg)
  var cos_azm = (Math.sin(obj.decJNow) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat));
  azm  = Math.acos(cos_azm);

  alt *= R2D;
  azm *= R2D;

   // Choose hemisphere
  if ( Math.sin(ha) > 0.0 )
    azm = 360.0 - azm;
}

// Compute the Mean Sidereal Time
function mean_sidereal_time( now, lon )
{
  var ye = now.getFullYear();
  var mo = now.getMonth() + 1;
  var da = now.getDate();
  var ho = now.getHours();
  var mi = now.getMinutes();
  var se = now.getSeconds();

  if ( mo <= 2 )
  {
    ye -= 1;
    mo += 12;
  }

  var a = Math.floor(ye / 100);
  var b = 2 - a + Math.floor(a / 4);
  var c = Math.floor(365.25 * ye);
  var d = Math.floor(30.6001 * (mo + 1));

   // Days since J2000.0
  var jd = b + c + d - 730550.5 + da + (ho + (mi / 60.0) + (se / 3600.0)) / 24.0;
  document.getElementById("julianday").innerHTML = fixed5(2451545.0 + jd);

   // Julian centuries since J2000.0
  var jt = jd / 36525.0;
  var jt2 = jt * jt;
  var jt3 = jt2 * jt;

   // Mean sidereal time in degrees
  Ds = (297.85036 + 445267.11148 * jt - 0.0019142 * jt2 + jt3 / 189474) * D2R;
  Ms = (357.52772 + 35999.05034 * jt - 0.0001603 * jt2 - jt3 / 300000) * D2R;
  M1s = (134.96298 + 477198.867398 * jt + 0.0086972 * jt2 + jt3 / 56250) * D2R;
  DFs = (93.27191 + 483202.017538 * jt - 0.0036825 * jt2 + jt3 / 327270) * D2R;
  OMs = (125.04452 - 1934.136261 * jt + 0.0020708 * jt2 + jt3 / 450000) * D2R;

  DPSI = -(171996 + 174.2 * jt) * Math.sin(OMs) - (13187 + 1.6 * jt) * Math.sin(-2 * Ds + 2 * DFs + 2 * OMs) - (2274 + 0.2 * jt) * Math.sin(2 * DFs + 2 * OMs) + (2062 + 0.2 * jt) * Math.sin(2 * OMs) + (1426 - 3.4 * jt) * Math.sin(Ms) + (712 + 0.1 * jt) * Math.sin(M1s);
  DPSI += (-517 + 1.2 * jt) * Math.sin(-2 * Ds + Ms + 2 * DFs + 2 * OMs) - (386 + 0.4 * jt) * Math.sin(2 * DFs + OMs) - 301 * Math.sin(M1s + 2 * DFs + 2 * OMs) + (217 - 0.5 * jt) * Math.sin(-2 * Ds - Ms + 2 * DFs + 2 * OMs) - 158 * Math.sin(-2 * Ds + M1s);
  DPSI += (129 + 0.1 * jt) * Math.sin(-2 * Ds + 2 * DFs + OMs) + 123 * Math.sin(-M1s + 2 * DFs + 2 * OMs) + 63 * Math.sin(2 * Ds) + (63 + 0.1 * jt) * Math.sin(M1s + OMs) - 59 * Math.sin(2 * Ds - M1s + 2 * DFs + 2 * OMs) - (58 + 0.1 * jt) * Math.sin(-M1s + OMs);
  DPSI -= 51 * Math.sin(M1s + 2 * DFs + OMs);
  DPSI += 48 * Math.sin(-2 * Ds + 2 * M1s) + 46 * Math.sin(-2 * M1s + 2 * DFs + OMs) - 38 * Math.sin(2 * Ds + 2 * DFs + 2 * OMs) - 31 * Math.sin(2 * M1s + 2 * DFs + 2 * OMs) + 29 * Math.sin(2 * M1s) + 29 * Math.sin(-2 * Ds + M1s + 2 * DFs + 2 * OMs) + 26 * Math.sin(2 * DFs);
  DPSI -= 22 * Math.sin(2 * DFs - 2 * Ds) + 21 * Math.sin(2 * DFs - M1s) + (17 - 0.1 * jt) * Math.sin(2 * Ms) + 16 * Math.sin(2 * Ds - M1s + OMs) - (16 - 0.1 * jt) * Math.sin(2 * (OMs + DFs + Ms - Ds)) - 15 * Math.sin(Ms + OMs) - 13 * Math.sin(OMs + M1s - 2 * Ds) - 12 * Math.sin(OMs - Ms);
  DPSI += 11 * Math.sin(2 * (M1s - DFs)) - 10 * Math.sin(2 * Ds - M1s + 2 * DFs) - 8 * Math.sin(2 * Ds + M1s + 2 * DFs + 2 * OMs) + 7 * Math.sin(Ms + 2 * DFs + 2 * OMs) - 7 * Math.sin(Ms + M1s - 2 * Ds) - 7 * Math.sin(2 * DFs + 2 * OMs - Ms) - 7 * Math.sin(2 * Ds + 2 * DFs + OMs);
  DPSI += 6 * Math.sin(2 * Ds + M1s);
  DPSI += 6 * Math.sin(2 * (OMs + DFs + M1s - Ds)) + 6 * Math.sin(OMs + 2 * DFs + M1s - 2 * Ds) - 6 * Math.sin(2 * Ds - 2 * M1s + OMs) - 6 * Math.sin(2 * Ds + OMs) + 5 * Math.sin(M1s - Ms) - 5 * Math.sin(OMs + 2 * DFs - Ms - 2 * Ds) - 5 * Math.sin(OMs - 2 * Ds) - 5 * Math.sin(OMs + 2 * DFs + 2 * M1s);
  DPSI += 4 * Math.sin(OMs - 2 * M1s - 2 * Ds) + 4 * Math.sin(OMs + 2 * DFs + Ms - 2 * Ds) + 4 * Math.sin(M1s - 2 * DFs) - 4 * Math.sin(M1s - Ds) - 4 * Math.sin(Ms - 2 * Ds) - 4 * Math.sin(Ds) + 3 * Math.sin(2 * DFs + M1s) - 3 * Math.sin(2 * (OMs + DFs - M1s)) - 3 * Math.sin(M1s - Ms - Ds);
  DPSI -= 3 * Math.sin(M1s + Ms);
  DPSI -= 3 * Math.sin(2 * OMs + 2 * DFs + M1s - Ms) - 3 * Math.sin(2 * OMs + 2 * DFs - M1s - Ms + 2 * Ds) - 3 * Math.sin(2 * OMs + 2 * DFs + 3 * M1s) - 3 * Math.sin(2 * OMs + 2 * DFs - Ms + 2 * Ds);
  DPSI *= 0.0001 / 3600;

  DEPS = (92025 + 8.9 * jt) * Math.cos(OMs) + (5736 - 3.1 * jt) * Math.cos(-2 * Ds + 2 * DFs + 2 * OMs) + (977 - 0.5 * jt) * Math.cos(2 * DFs + 2 * OMs) + (-895 + 0.5 * jt) * Math.cos(2 * OMs) + (54 - 0.1 * jt) * Math.cos(Ms) - 7 * Math.cos(M1s);
  DEPS += (224 - 0.6 * jt) * Math.cos(-2 * Ds + Ms + 2 * DFs + 2 * OMs) + 200 * Math.cos(2 * DFs + OMs) + (129 - 0.1 * jt) * Math.cos(M1s + 2 * DFs + 2 * OMs) + (-95 + 0.3 * jt) * Math.cos(-2 * Ds - Ms + 2 * DFs + 2 * OMs) - 70 * Math.cos(-2 * Ds + 2 * DFs + OMs);
  DEPS -= 53 * Math.cos(-M1s + 2 * DFs + 2 * OMs) - 33 * Math.cos(M1s + OMs) + 26 * Math.cos(2 * Ds - M1s + 2 * DFs + 2 * OMs) + 32 * Math.cos(-M1s + OMs) + 27 * Math.cos(M1s + 2 * DFs + OMs) - 24 * Math.cos(-2 * M1s + 2 * DFs + OMs);
  DEPS += 16 * Math.cos(2 * (Ds + DFs + OMs)) + 13 * Math.cos(2 * (M1s + DFs + OMs)) - 12 * Math.cos(2 * OMs + 2 * DFs + M1s - 2 * Ds) - 10 * Math.cos(OMs + 2 * DFs - M1s) - 8 * Math.cos(2 * Ds - M1s + OMs) + 7 * Math.cos(2 * (OMs + DFs + Ms - Ds)) + 9 * Math.cos(Ms + OMs);
  DEPS += 7 * Math.cos(OMs + M1s - 2 * Ds) + 6 * Math.cos(OMs - Ms) + 5 * Math.cos(OMs + 2 * DFs - M1s + 2 * Ds) + 3 * Math.cos(2 * OMs + 2 * DFs + M1s + 2 * Ds) - 3 * Math.cos(2 * OMs + 2 * DFs + Ms) + 3 * Math.cos(2 * OMs + 2 * DFs - Ms) + 3 * Math.cos(OMs + 2 * DFs + 2 * Ds);
  DEPS -= 3 * Math.cos(2 * (OMs + DFs + M1s - Ds)) - 3 * Math.cos(OMs + 2 * DFs + M1s - 2 * Ds) + 3 * Math.cos(OMs - 2 * M1s + 2 * Ds) + 3 * Math.cos(OMs + 2 * Ds) + 3 * Math.cos(OMs + 2 * DFs - Ms - 2 * Ds) + 3 * Math.cos(OMs - 2 * Ds) + 3 * Math.cos(OMs + 2 * DFs + 2 * M1s);
  DEPS *= 0.0001 / 3600;

  EPS = (21.448 / 60 + 26) / 60 + 23 + (-46.815 * jt - 0.00059 * jt2 + 0.001813 * jt3) / 3600;
  EPS += DEPS;
  var gst = 280.46061837 + (360.98564736629 * jd) + (0.000387933 * jt2) - (jt3 / 38710000);
  gst += DPSI * Math.cos(EPS * D2R);
  gst = rev(gst);
  document.getElementById("gst").innerHTML = fixed5(gst / 15);
  d1 = ((gst / 15 - Math.floor(gst / 15)) * 60);
  d2 = ((d1 - Math.floor(d1)) * 60);
  document.getElementById("gsth").innerHTML = Math.floor(gst / 15) + "h" + zero(Math.floor(d1)) + "m" + zeroFixed2(d2) + "s";
  var mst = gst + lon;
  mst = rev(mst);
  document.getElementById("lst").innerHTML = fixed5(mst / 15);
  d1 = ((mst / 15 - Math.floor(mst / 15)) * 60);
  d2 = ((d1 - Math.floor(d1)) * 60);
  document.getElementById("lsth").innerHTML = Math.floor(mst / 15) + "h" + zero(Math.floor(d1)) + "m" + zeroFixed2(d2) + "s";

  return mst;
}

function geocentric2topocentricAltAz( alt_geoc, dist )
{
  var corr = Math.atan(Math.cos(alt_geoc * D2R) / (dist - Math.sin(alt_geoc * D2R)));
  var alt_topoc = alt_geoc - (corr * R2D);

  return alt_topoc;
}

// Meeus AA Ch. 16
function refraction( true_alt )
{
//  var R = 1.02 / Math.tan((apparent_alt + (10.3 / (apparent_alt + 5.11))) * D2R);	// In minutes of arc

  var R = 1.0 / Math.tan((true_alt + (7.31 / (true_alt + 4.4))) * D2R);	// In minutes of arc
  R -= 0.06 * Math.sin(((14.7 * R / 60.0) + 13.0) * D2R);

  R /= 60.0;	// In degrees

  return R;
}

// Convert epoch J2000 to JNow
function ConvertJ2000ToJNow( year, month, day, hour, minute, second, obj )
{
  var jd = julianDay(day, month, year, hour, minute, second);
  var t = (jd - 2451545.0) / 36525.0;
  var t2 = t * t;
  var t3 = t2 * t;

  var zeta = (2306.2181 * t) + (0.30188 * t2) + (0.017998 * t3);
  zeta *= D2R / 3600.0;
  var z = (2306.2181 * t) + (1.09468 * t2) + (0.018203 * t3);
  z *= D2R / 3600.0;
  var theta = (2004.3109 * t) - (0.42665 * t2) - (0.041833 * t3);
  theta *= D2R / 3600.0;

  var ra = obj.ra * D2R;
  var dec = obj.dec * D2R;
  var A = Math.cos(dec) * Math.sin(ra + zeta);
  var B = (Math.cos(theta) * Math.cos(dec) * Math.cos(ra + zeta)) - (Math.sin(theta) * Math.sin(dec));
  var C = (Math.sin(theta) * Math.cos(dec) * Math.cos(ra + zeta)) - (Math.cos(theta) * Math.sin(dec));

  obj.raJNow = Math.atan2(A, B) + z;
  if ( obj.raJNow < 0.0 )
    obj.raJNow += PIx2;
  else if ( obj.raJNow > PIx2 )
    obj.raJNow -= PIx2;
  obj.raJNow *= R2D;
  obj.decJNow = Math.acos(Math.sqrt((A * A) + (B * B)));	// Math.asin(C);
  if ( (obj.decJNow * obj.dec) < 0.0 )
    obj.decJNow = -obj.decJNow;
  obj.decJNow *= R2D;
}

// Julian day from the beginning of the year -4712 at noon UT
function julianDay( day, month, year, hour, minute, second )
{
  var y, m, a, b;

  var gregorian = true;
  if ( year < 1582 )
    gregorian = false;
  else if ( year == 1582 )
  {
    if ( ( month < 10 ) || ( ( month == 10 ) && ( day < 15 ) ) )
      gregorian = false;
  }
  if ( month > 2 )
  {
    y = year;
    m = month;
  }
  else
  {
    y = year - 1;
    m = month + 12;
  }

  a = truncate(y / 100);
  if ( gregorian )
    b = 2 - a + truncate(a / 4);
  else
    b = 0.0;
  var jd = truncate(365.25 * (y + 4716)) + truncate(30.6001 * (m + 1)) + day + b - 1524.5;
  jd += (hour + (minute / 60) + (second / 3600)) / 24;

  return jd;
}

//
// Return an angle between 0 and 360 degrees
function rev( angle )
{
  return angle - (360.0 * Math.floor(angle / 360.0));
}

function truncate( x )
{
  return ( x >= 0.0 ) ? Math.floor(x) : Math.ceil(x);
}

// Convert right ascension (hours, minutes, secons) to degrees as real
function ra2real( hr, min, sec )
{
  return 15 * (hr + (min / 60) + (sec / 3600));
}

// Convert angle (degrees, minutes, seconds) to degrees as real
function dms2real( deg, min, sec )
{
  var rv;

  if ( deg < 0 )
    rv = deg - (min / 60) - (sec / 3600);
  else
    rv = deg + (min / 60) + (sec / 3600);

  return rv;
}

function fixed2( ze )
{
  ze = ze.toFixed(2);

  return ( myLanguage == "fr" ) ? ("" + ze.replace(/\./, ',')) : ze;
}

function fixed5( ze )
{
  ze = ze.toFixed(5);

  return ( myLanguage == "fr" ) ? ("" + ze.replace(/\./, ',')) : ze;
}

function zero( ze )
{
  if ( ze < 10 )
    ze = "0" + ze;

  return ze;
}

function zeroFixed2( ze )
{
  ze = ze.toFixed(2);
  if ( ze < 10 )
    ze = "0" + ze;
  else
    ze = "" + ze;

  return ( myLanguage == "fr" ) ? ze.replace(/\./, ',') : ze;
}
//-->