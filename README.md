stickyscroll
============

A JavaScript class that allows for a sidebar to follow the user as they scroll down the page.  

This assumes that the side bar is on the right and not on the left.  The code could be adjusted to make it for configurable but for now it is not supported.

###Demo
        http://gforti.github.io/stickyscroll/

###@params scrollerID

        The ID of the Div to set as the sticky scroll object.

###@params rightOfID

        The ID of the Div to set the location of the sticky scroll object to the right off.
        
###@params limitID

        The ID of the Div to set the scroll bottom limit of the sticky scroll object.

###Usage

       stickyScroll.observe("sidebar","content");
        
