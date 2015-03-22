# TabContainer
This is my first published plugin. It was created as a project assignment when attending a course at BTH.

My plugin converts a div structure into a tabpage container with responsive
behaviour.

Download js-file and css-file and add reference to them in your page before usage. 
Make sure the js-file is included after the ordinary JQuery-reference.

To invoke:

$('#maincontainer').createTabs();

 Possible inarguments:

             startWidth: '100%',
             selectedTabIndex: 0,
             tabPosition: 'top',                               'top'|'bottom'
             breakpointResponsiveInPixels: '500',
             responsive: 'true',                               'true'|'false'
             afterSelectedTabChanged: afterSelectedTab 
