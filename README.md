Visualize New York City Schools
===============================

Members
-------

*   Hannah Keiler
*   Jeremy Myers
*   George Tsai
*   Stephen Zhou

Summary
-------

We are exploring and visualizing the relationship between the local New York
City environment and school performance using public data sets from nyc.gov and
NYC Open Data.

Folder Hierarchy
----------------

    css/    custom css
    js/     custom js
    json/   json resource files
    lib/    third-party sources
        bootstrap/
        d3/
        jquery/
    scripts/
    index.html 

Instructions
------------

### Usage

Start a HTTP server in the directory. I recommend Python's SimpleHTTPServer.

    $ pythom -m SimpleHTTPServer 8080

Then, go to localhost:8080 on your browser.

Otherwise, visit http://visualizeschools.com/ for a relatively up-to-date
deployment of the site.

### Simplify Shapefiles

The Shapefiles provided by NYC.gov are far too detailed for the purposes for
this project's visualization. Converted to GeoJSON format, each map is a
whooping 3.8 MB.

To make the size more manageable so interactive components like pan and zoom
aren't laggy, we should first simplify the maps. This can be done easily using
qgis.

1.  Open qgis and add the Shapefile vector
2.  Vector > Geometry Tools > Simplify geometries
3.  Select input features, set the Save as to another directory, pick a
    tolerance level
    *   As a reference, a tolerance of 10 cuts the filesize down from 3.8 MB to
        926 KB 
4.  Click OK

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


