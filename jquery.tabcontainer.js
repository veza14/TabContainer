/**
 * JQuery plugin that converts a div structure into a tabpage container with responsive
 * behaviour.
 *
 * To invoke:
 * 
 * $('#maincontainer').createTabs();
 *
 * Possible inarguments:
 *
 *             startWidth: '100%',
 *             selectedTabIndex: 0,
 *             tabPosition: 'top',                               'top'|'bottom'
 *             breakpointResponsiveInPixels: '500',
 *             responsive: 'true',                               'true'|'false'
 *             afterSelectedTabChanged: afterSelectedTab 
 *
 * @author Veronika Sjödin  
 * @date 2015-03-22
 *
 * Revisions: N/A
 *
 */
 (function($) {
    'use strict';
       
    // Tabs      
    $.fn.createTabs = function (options) {
        var mainContainerId = null, tabContainerObj = null, tabContainerId = null, tabContentId = null, tabObj = null, tabLIClass = 'top', tabULClass = 'tabULBasic',
        responsiveClass = 'mini',
        insertBefore = true, tabstr = null, nofTabs = 0, idSel = null, hrefstr = null,
        options = $.extend({}, $.fn.createTabs.defaults, options),
        /*
         * Checks if the size of the windows calls for a redesign of the tabpage container to fit smaller screens.
         */
        doCheckAndReSize = function () {
            var windowHeight = window.innerHeight || $(window).height(),
            windowWidth  = window.innerWidth  || $(window).width(); 
            
            console.log('Window resized to Height: ' + windowHeight + ' Width: ' + windowWidth);
            
            // Check if we should work responsive
            if(options.responsive === 'true'){
                // We should handle the tabs differently, displaying the contents below LI.
                if(windowWidth < options.breakpointResponsiveInPixels) {
                    if($(("#" + mainContainerId)).hasClass(responsiveClass) === false){
                        console.log('We should adjust the layout to mini format');
                        $(("#" + mainContainerId)).addClass(responsiveClass);
                        $(("#" + tabContainerId)).addClass(responsiveClass);
                        $(("#" + mainContainerId + " ." + tabLIClass)).addClass(responsiveClass);
                        
                        // We should move the contents into the tabs
                        $(("#" + mainContainerId + ' .tabContent')).each(function () {
                            tabContentId = $(this).attr('id');
                            $(this).addClass(responsiveClass);
                            $(this).appendTo(("#" + tabContentId + '_LI'));
                        });
                    }
                }
                else if($("#" + mainContainerId).hasClass(responsiveClass) === true){
                    // We should restore the contents to be outside the tabs
                    $(("#" + mainContainerId)).removeClass(responsiveClass);
                    $(("#" + tabContainerId)).removeClass(responsiveClass);
                    $(("#" + mainContainerId + " ." + tabLIClass)).removeClass(responsiveClass);
                    
                    $(("#" + mainContainerId + ' .tabContent')).each(function () {
                        console.log('We should restore the layout from mini format');                       
                        $(this).removeClass(responsiveClass);
                        
                        if(options.tabPosition === 'top'){
                            $(this).appendTo(("#" + mainContainerId));
                        }
                        else if(options.tabPosition === 'bottom') {
                            $(this).prependTo(("#" + mainContainerId));
                        }
                        else{
                            $(this).appendTo(("#" + mainContainerId));                            
                        }                        
                    });                    
                }
            }
        };

        // Save the id of the $(this) in case we loose it.       
        mainContainerId = $(this).attr('id'); 

        console.log("Options for mainContainerId " + mainContainerId);
        console.log("-----------------------------------");
        console.log("startWidth: " + options.startWidth);
        console.log("selectedTabIndex: " + options.selectedTabIndex);
        console.log("tabPosition: " + options.tabPosition);
        console.log("breakpointResponsiveInPixels: " + options.breakpointResponsiveInPixels);
        console.log("responsive: " + options.responsive);        
        console.log("afterSelectedTabChanged: " + options.afterSelectedTabChanged);        
        
        // We have our main wrapper
        $(this)
            .addClass('tabContentContainer')
            .css('width',options.startWidth);

        // Set class according to how  the tabs should be displayed
        if(options.tabPosition === 'top'){
          tabLIClass = 'top';
        }
        else if(options.tabPosition === 'bottom') {
          tabLIClass = 'bottom';
          insertBefore = false;
        }
        
        // Create the ul-list
        tabContainerId = mainContainerId + '_' + 'tabContainer';
        tabContainerObj = $("<ul></ul>")
                              .addClass(tabULClass)
                              .attr('id', tabContainerId);

        // Include the list in the main container                            
        if(insertBefore === true){
            $(this).prepend(tabContainerObj);            
        }
        else{
            $(this).append(tabContainerObj);                        
        }

        $("<p class='clearFloat'></p>")
            .insertAfter(("#" + mainContainerId));

        $(this).children().each(function () {
            // Check that we are not processing the container id
            tabContentId = $(this).attr('id');
            if(tabContentId !== tabContainerId){          
              $(this).addClass('tabContent');
              tabstr = $(this).find('.tabHeader').html();
              $(this).find('.tabHeader').hide();
            
              nofTabs = nofTabs + 1;
              
              // Add list object 
              tabObj = $("<li></li>")
                          .addClass(tabLIClass)
                          .attr('id', (tabContentId + '_LI'))
                          .click(function (event) {
                              event.preventDefault();
                              $(("#" + mainContainerId + ' .tabContent')).hide();
                              $(("#" + mainContainerId + ' .selected')).removeClass('selected');
                              $(this).addClass('selected');
                            
                              // Find the one that should be visible
                              var clicked = $(this).find('a:first').attr('href');
                              $(clicked).fadeIn('fast');
                              
                              if($.isFunction(options.afterSelectedTabChanged)){
                                  console.log("Clicked tab link href: " + clicked);
                                  options.afterSelectedTabChanged(clicked);
                              }
                          })
                          .appendTo(tabContainerObj);
                    
                    hrefstr = '#' + tabContentId;
                    
                    // Add reference 
                    $("<a></a>")
                        .attr("href", hrefstr)
                        .html(tabstr)
                        .appendTo(tabObj);
            }
        });
        
        $(("#" + mainContainerId + ' .tabContent')).hide();
        
        // Select the first if not stated or if selectedTabIndex is out of range
        if(options.selectedTabIndex < 0 || options.selectedTabIndex >= nofTabs){
            console.log('options.selectedTabIndex is out of range: ' + options.selectedTabIndex + 'defaulting to 0');
            options.selectedTabIndex = 0;
        }
        
        $(("#" + mainContainerId + ' .' + tabLIClass)).eq(options.selectedTabIndex).trigger( "click" );
        
        // Also check if we should resize do to small window size
        doCheckAndReSize();

        $(window).resize(function () {
            doCheckAndReSize();
        });
        
        return this;
    };
    
    $.fn.createTabs.defaults = {
        startWidth: '100%',
        selectedTabIndex: 0,
        tabPosition: 'top',
        breakpointResponsiveInPixels: '500',
        responsive: 'true',
        afterSelectedTabChanged: null       
    };
})(jQuery);