using System;
using CoordinatesConvertLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CoordinatesConvertTest
{
    [TestClass]
    public class LibraryTests
    {
        [TestMethod]
        public void Sladovnicka28_Plzen()
        {
            var home = SJTSKConvert.ToWGS84(1071843.78, 820447.80, 245);
            Assert.IsNotNull(home);
            Assert.AreEqual(Math.Round(home.Latitude, 2), Math.Round(49.7308068, 2));  // 49.731049861996112
            Assert.AreEqual(Math.Round(home.Longitude, 2), Math.Round(13.4083905, 2));  // 13.408825274491719
            Assert.AreEqual(home.LatitudeString, "49°43'51.78N"); // "49°43'51.78N"
            Assert.AreEqual(home.LongitudeString, "13°24'31.771E"); // "13°24'31.771E"
        }

        [TestMethod]
        public void Brojova13_Plzen()
        {
            var home = SJTSKConvert.ToWGS84(1072033.40, 820759.17, 245);
            Assert.IsNotNull(home);
            Assert.AreEqual(Math.Round(home.Latitude, 2), Math.Round(49.7289559, 2));  
            Assert.AreEqual(Math.Round(home.Longitude, 2), Math.Round(13.402769, 2));  
            Assert.AreEqual(home.LatitudeString, "49°43'44.202N"); 
            Assert.AreEqual(home.LongitudeString, "13°24'17.816E"); 
        }

        [TestMethod]
        public void Koterovska83_Plzen()
        {
            var home = SJTSKConvert.ToWGS84(1071665.08, 820823.26, 245);
            Assert.IsNotNull(home);
            Assert.AreEqual(Math.Round(home.Latitude, 2), Math.Round(49.7319559, 2));  
            Assert.AreEqual(Math.Round(home.Longitude, 2), Math.Round(13.4012254, 2));  
            Assert.AreEqual(home.LatitudeString, "49°43'55.679N"); 
            Assert.AreEqual(home.LongitudeString, "13°24'11.896E"); 
        }

        [TestMethod]
        public void NamestiRepubliky41_Plzen()
        {
            var home = SJTSKConvert.ToWGS84(1069615.41, 822397.05, 245);
            Assert.IsNotNull(home);
            Assert.AreEqual(Math.Round(home.Latitude, 2), Math.Round(49.7474419, 2));  
            Assert.AreEqual(Math.Round(home.Longitude, 2), Math.Round(13.3774703, 2));  
            Assert.AreEqual(home.LatitudeString, "49°44'53.635N"); 
            Assert.AreEqual(home.LongitudeString, "13°22'38.827E"); 
        }
    }
}
