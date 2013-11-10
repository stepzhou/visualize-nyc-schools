Visualize New York City Schools
===============================

Members
-------

*   Hannah Keiler
*   Jeremy Myers
*   George Tsai
*   Stephen Zhou

Instructions
------------

### Run Locally

I recommend using the Python SimpleHTTPServer

    $ pythom -m SimpleHTTPServer 8080

Then, go to localhost:8080 on your browser

### Convert Shapefiles to GeoJSON

NYC releases several maps as shapefiles on their website
(http://www.nyc.gov/html/dcp/html/bytes/dwndistricts.shtml).

However, the shapefiles encode the location coordinates using the Universal
Transverse Mercator (UTM) coordinate system, which D3 geo does not support.

In order to map on D3, we must convert the shapefiles into GeoJSON format and
the UTM coordinates into lat/long (either NAD83 or WGS72).

1.  Open the shp file in qgis
2.  Layer > Save As
    *   Format: GeoJSON
    *   CRS: either NAD83 or WGS 72 
3.  Specify a file name
4.  Save

