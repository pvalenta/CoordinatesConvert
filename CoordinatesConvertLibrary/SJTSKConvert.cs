using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoordinatesConvertLibrary
{
    public class SJTSKConvert
    {
        /// <summary>
        /// convert to WGS-84
        /// </summary>
        /// <param name="x">X location</param>
        /// <param name="y">Y location</param>
        /// <param name="height">height</param>
        /// <returns></returns>
        public static WGS84Coordinates ToWGS84(double x, double y, double height)
        {
            var result = new WGS84Coordinates();

            double e = 0.081696831215303;
            double n = 0.97992470462083;
            double konst_u_ro = 12310230.12797036;
            double sinUQ = 0.863499969506341;
            double cosUQ = 0.504348889819882;
            double sinVQ = 0.420215144586493;
            double cosVQ = 0.907424504992097;
            double alfa = 1.000597498371542;
            double k = 1.003419163966575;

            double ro = Math.Sqrt(x * x + y * y);
            double epsilon = 2 * Math.Atan(y / (ro + x));
            double d = epsilon / n;
            double s = 2 * Math.Atan(Math.Exp(1 / n * Math.Log(konst_u_ro / ro))) - Math.PI / 2;
            double sinS = Math.Sin(s);
            double cosS = Math.Cos(s);
            double sinU = sinUQ * sinS - cosUQ * cosS * Math.Cos(d);
            double cosU = Math.Sqrt(1 - sinU * sinU);
            double sinDV = Math.Sin(d) * cosS / cosU;
            double cosDV = Math.Sqrt(1 - sinDV * sinDV);
            double sinV = sinVQ * cosDV - cosVQ * sinDV;
            double cosV = cosVQ * cosDV + sinVQ * sinDV;
            double Ljtsk = 2 * Math.Atan(sinV / (1 + cosV)) / alfa;
            double t = Math.Exp(2 / alfa * Math.Log((1 + sinU) / cosU / k));
            double pom = (t - 1) / (t + 1);

            double sinB;
            do
            {
                sinB = pom;
                pom = t * Math.Exp(e * Math.Log((1 + e * sinB) / (1 - e * sinB)));
                pom = (pom - 1) / (pom + 1);
            } while (Math.Abs(pom - sinB) > 1e-15);

            double Bjtsk = Math.Atan(pom / Math.Sqrt(1 - pom * pom));

            /* Pravoúhlé souřadnice ve S-JTSK */
            double a = 6377397.15508;
            double f_1 = 299.152812853;
            double e2 = 1 - (1 - 1 / f_1) * (1 - 1 / f_1);
            ro = a / Math.Sqrt(1 - e2 * Math.Sin(Bjtsk) * Math.Sin(Bjtsk));
            x = (ro + height) * Math.Cos(Bjtsk) * Math.Cos(Ljtsk);
            y = (ro + height) * Math.Cos(Bjtsk) * Math.Sin(Ljtsk);
            double z = ((1 - e2) * ro + height) * Math.Sin(Bjtsk);

            /* Pravoúhlé souřadnice v WGS-84 */
            double dx = 570.69;
            double dy = 85.69;
            double dz = 462.84;
            double wz = -5.2611 / 3600 * Math.PI / 180;
            double wy = -1.58676 / 3600 * Math.PI / 180;
            double wx = -4.99821 / 3600 * Math.PI / 180;
            double m = 3.543e-6;
            double xn = dx + (1 + m) * (x + wz * y - wy * z);
            double yn = dy + (1 + m) * (-wz * x + y + wx * z);
            double zn = dz + (1 + m) * (wy * x - wx * y + z);

            /* Geodetické souřadnice v systému WGS-84 */
            a = 6378137.0;
            f_1 = 298.257223563;
            double a_b = f_1 / (f_1 - 1);
            double p = Math.Sqrt(xn * xn + yn * yn);
            e2 = 1 - (1 - 1 / f_1) * (1 - 1 / f_1);
            double theta = Math.Atan(zn * a_b / p);
            double st = Math.Sin(theta);
            double ct = Math.Cos(theta);
            t = (zn + e2 * a_b * a * st * st * st) / (p - e2 * a * ct * ct * ct);
            double b = Math.Atan(t);
            double l = 2 * Math.Atan(yn / (p + xn));
            height = Math.Sqrt(1 + t * t) * (p - a / Math.Sqrt(1 + (1 - e2) * t * t));

            /* Formát výstupních hodnot */
            b = b / Math.PI * 180;
            result.Latitude = b;
            result.LatitudeString = "N";
            if (b < 0)
            {
                b = -b;
                result.LatitudeString = "S";
            }
            double st_sirky = Math.Floor(b);
            b = (b - st_sirky) * 60;
            double min_sirky = Math.Floor(b);
            b = (b - min_sirky) * 60;
            double vt_sirky = Math.Round(b * 1000) / 1000;
            result.LatitudeString = st_sirky + "°" + min_sirky + "'" + vt_sirky + result.LatitudeString;

            l = l / Math.PI * 180;
            result.Longitude = l;
            result.LongitudeString = "E";
            if (l < 0)
            {
                l = -l;
                result.LongitudeString = "W";
            }
            double st_delky = Math.Floor(l);
            l = (l - st_delky) * 60;
            double min_delky = Math.Floor(l);
            l = (l - min_delky) * 60;
            double vt_delky = Math.Round(l * 1000) / 1000;
            result.LongitudeString = st_delky + "°" + min_delky + "'" + vt_delky + result.LongitudeString;

            result.Height = Math.Round((height * 100) / 100);

            return result;
        }
    }
}
