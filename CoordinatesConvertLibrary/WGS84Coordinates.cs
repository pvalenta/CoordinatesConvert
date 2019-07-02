using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoordinatesConvertLibrary
{
    /// <summary>
    /// WGS-84 Coordinates
    /// </summary>
    public class WGS84Coordinates
    {
        /// <summary>
        /// Latitude in string
        /// </summary>
        public string LatitudeString { get; set; }
        /// <summary>
        /// Longitude in string
        /// </summary>
        public string LongitudeString { get; set; }
        /// <summary>
        /// Latitude
        /// </summary>
        public double Latitude { get; set; } 
        /// <summary>
        /// Longitude
        /// </summary>
        public double Longitude { get; set; }
        /// <summary>
        /// height
        /// </summary>
        public double Height { get; set; }
    }
}
