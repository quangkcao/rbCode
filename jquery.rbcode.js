/****************
*Plugin: rbCode
*Type:jQuery
*Author: Quang K. Cao 
*Website: www.runbusi.com
*Version 1.1.0
*Licensed under the MIT license.
*DESCRIPTION
*jQuery 1.7.x
*Main: 
*	- Show code with numbers, zebra and popout effects
*	- Popout window appears in the center of the window
*	- 'Esc' key support to exit popout mode. 
*	- Image button support		
*	- Keep a popout box in the center of the window even when window is resized
*
*DEFAULT VALUES
*is_number:true//indicate show number or not
*is_zebra:true//indicate show zebra effect or not
*zebra_bg:'#CCC'//indicate background of zebra effect
*zebra_cross_bg:'#FFF'//indicate background of zebra cross lines
*modal_bg:'#000'//indicate background of modal window
*bg:'#CCC'//indicate background
*text_color:'#000'//text color
*list_color:'#CCC'//color of list style such number
*z_index:999// popout 999 and modal window 999-1
*opacity:0.75// transperancy of modal window
*a_number:['Hide Number','Show Number']//label Number button
*a_zebra:['Hide Zebra','Show Zebra', 'text']//label Zebra button
*a_popout:['Pop Out','Close', 'text']//label Popout button
****************/
(function( $ ){
	$.fn.rbCode = function(options) {
		var defaults = {is_number:true,
						is_zebra:true,						
						zebra_bg:'#CCC',						
						zebra_cross_bg:'#FFF',						
						modal_bg:'#000',						
						bg:'#CCC',
						text_color:'#000',
						list_color:'#333',
						z_index:999,
						opacity:0.75,
						a_number:['Hide Number','Show Number','text'],
						a_zebra:['Hide Zebra','Show Zebra','text'],
						a_popout:['PopOut','Close','text']																	
						}; 			
		
		var str_replace='</span></li><li><span>';			
		var str='';			
		var toolbar='';
		var z_index;
		var precode,ol;
		var doc=$(document);
		var win=$(window);
		var tmp;
		var check_zebra, check_number;
		//check #popout_modal exist
		if($('#popout_modal').length==0){
			tmp=document.createElement('div');
			tmp.id="popout_modal";
			document.body.appendChild(tmp);			
		}
		var modal=$('#popout_modal');		
		modal.css({'top':'0',
					'left':'0',
					'width':'100%',
					'height':'100%',
					'background':defaults.modal_bg,					
					'position':'fixed',
					'z-index':defaults.z_index-1,
					'opacity':defaults.opacity,
					'display':'none'});						
		return this.each(function(){
			if ( options )  $.extend( defaults, options );		
			$(this).css({'background':defaults.bg,
						 'color':defaults.text_color,
						 'padding':'5px',							 						 
						 '-webkit-border-radius': '5px',
						 '-moz-border-radius':'5px',
						 'border-radius': '5px'
						 });	
			check_zebra=defaults.is_zebra;
			check_number=defaults.is_number;
			
			<!--zebra button-->			
			str='<a class="toggleZebra" title="" href="">';
			switch (defaults.a_zebra[2])
			{
				case 'text':
					str+=defaults.a_zebra[(defaults.is_zebra)?0:1];
					break;
				case 'image':
					str+='<img alt="" src="'+defaults.a_zebra[(defaults.is_zebra)?0:1]+'"/>';
					break;
				default:
					str+=defaults.a_zebra[(defaults.is_zebra)?0:1];
				
			};
			str+='</a> ';
			<!--number button-->
			str+='<a class="toggleNumber" title="" href="">';
			switch (defaults.a_number[2])
			{
				case 'text':
					str+=defaults.a_number[(defaults.is_number)?0:1];
					break;
				case 'image':
					str+='<img alt="" src="'+defaults.a_number[(defaults.is_number)?0:1]+'"/>';
					break;
				default:
					str+=defaults.a_number[(defaults.is_number)?0:1];
					break;
				
			};
			str+='</a> ';
			<!--popout button-->
			str+='<a class="togglePopout" title="" href="">';
			switch (defaults.a_popout[2])
			{
				case 'text':
					str+=defaults.a_popout[0];
					break;
				case 'image':
					str+='<img alt="" src="'+defaults.a_popout[0]+'"/>';
					break;
				default:
					str+=defaults.a_popout[0];
					break;
				
			}
			str+='</a> ';			
			toolbar='<div class="toolbar" style="text-align:right;">'+str+'</a> </div>';			
			zebra=$('.toggleZebra',$(this));
			number=$('.toggleNumber',$(this));
			popout=$('.togglePopout',$(this));					
			str=$(this).html();	
			str=str.replace(/\t/g,'     ');						
			if(str.substr(0,3)=='<p>') str=str.substr(3,str.length);//fix for begining <p>
			str=str.replace(/<p>/g,'\n');				
			str=str.replace(/<\/p>/g,'');	
			str=str.replace(/\n/g,'<br/>');	
			if(str.substr(str.length-5,5)=='<br/>') str=str.substr(0,str.length-5);//fix for last \n
			str=str.replace(/<BR>/g,'<br/>');//IE		
			str=str.replace(/<BR\/>/g,'<br/>');
			str=str.replace(/<br>/g,str_replace);	
			str=str.replace(/<br\/>/g,str_replace);	
			//<div class="precode"><ol><li><span>'+str+'</span></li></ol></div>'
			tmp=document.createElement('div');
			tmp.className="precode";
			tmp.innerHTML='<ol><li><span>'+str+'</span></li></ol>';
			$(this).html(tmp);
			precode=$('.precode',$(this));
			ol=$('.precode ol',$(this));			
			precode.css('overflow','auto');
			//set number						
			ol.css({'list-style': (defaults.is_number)?'decimal inside':'none',
					'color':defaults.list_color,
					'margin': 0,
					'padding': 0					
					}) ;						
			//set zebra						
			if(defaults.is_zebra){	
				resetOL(ol,precode);				
				var i=0;
				$("ol li",$(this)).each(function(){			 	
					if(i%2==1)
						$(this).css('background',defaults.zebra_bg);
					else
						$(this).css('background',defaults.zebra_cross_bg);
					i++;
				})
			}	
			$("ol li span",$(this)).css('color',defaults.text_color);
			$("ol li span",$(this)).each(function(){ //fix line with only space
				if($(this).html()=='') $(this).html('&nbsp;');				
			})
			$(this).prepend(toolbar);
			$(this).on("mouseenter", onMouseEnter); 		
			$(this).on("mouseleave", onMouseLeave); 						
			$(this).on("keyup", function(e){					
				if (e.keyCode == 27) 
				{ 
					closePopOut();					
				}					 
			})
			win.on("resize", function(){								
				resetOL(ol,precode);								
				onPopOutResize();
			})
			
		});	
		function onMouseEnter(e){		
			$(this).on("click", ".toggleZebra", onToggleZebra); 
			$(this).on("click", ".toggleNumber", onToggleNumber); 
			$(this).on("click", ".togglePopout", onTogglePopOut);					
		}
		function onMouseLeave(e){		
			$(this).off("click", ".toggleZebra", onToggleZebra); 
			$(this).off("click", ".toggleNumber", onToggleNumber); 
			$(this).off("click", ".togglePopout", onTogglePopOut);								
		}
		function onToggleZebra(e){				
			precode=$('.precode',$(this).parent().parent());
			ol=$('.precode ol',$(this).parent().parent());
			var i=0;			
			var li=$("ol li",$(this).parent().parent());
			if(check_zebra!=defaults.is_zebra){
				li.each(function(){
					if(i%2==1)
						$(this).css('background',defaults.zebra_bg);
					else
						$(this).css('background',defaults.zebra_cross_bg);
					i++;					
				})	
			}else{
				li.each(function(){
					$(this).css('background','none');
				})
			}	
			check_zebra=!check_zebra;
			switch (defaults.a_zebra[2])
			{
				case 'text':
					$(this).html(defaults.a_zebra[(check_zebra)?0:1]);
					break;
				case 'image':
					$('img',$(this)).attr('src',defaults.a_zebra[(check_zebra)?0:1]);
					break;
				default:
					$(this).html(defaults.a_zebra[(check_zebra)?0:1]);				
			};
			return false;						
		}
		function onToggleNumber(e){					
			ol=$('.precode ol',$(this).parent().parent());
			if(check_number!=defaults.is_number){
				ol.css('list-style','decimal inside');	
			}else{
				ol.css('list-style','none');	
			}
			check_number=!check_number
			switch (defaults.a_number[2])
			{
				case 'text':
					$(this).html(defaults.a_number[(check_number)?0:1]);
					break;
				case 'image':
					$('img',$(this)).attr('src',defaults.a_number[(check_number)?0:1]);
					break;
				default:
					$(this).html(defaults.a_number[(check_number)?0:1]);				
			};
			return false;
		}	
		function onTogglePopOut(e){		 
			modal.css({'background':defaults.modal_bg,					
					'z-index':defaults.z_index-1,
					'opacity':defaults.opacity
					})
			var o=$(this).parent().parent();			
			precode=$('.precode',o);	
			ol=$('.precode ol',o);
			resetOL(ol,precode);			
			var toolbar=$('.toolbar',o);
			if(o.css('z-index')!=999){
				z_index=o.css('z-index');				
			}						
			if(o.hasClass('popout')){				
				closePopOut();				
			}else{
				modal.show();	
				o.addClass('popout');				
				o.css({'top':0,
						'left':0,
						'position':'fixed'									
							});								
				var newHeight=o.height();
				var newWidth=o.width();		
							//update info		
				precode.css({'width':(newWidth>=win.width())?(win.width()-toolbar.height()):(newWidth+2*toolbar.height())+'px',
							'height':(newHeight>=win.height())?(win.height()-2*toolbar.height()):newHeight+'px'
						});
				resetOL(ol,precode);
				o.css({'top':(newHeight<=win.height())?((win.height()-newHeight)/2-toolbar.height()):0+'px',
						'left':(newWidth<=win.width())?((win.width()-newWidth)/2-toolbar.height()):0+'px',
						'width':(newWidth>win.width())?win.width():(newWidth+2*toolbar.height())+'px',
						'height':(newHeight>win.height())?win.height():(newHeight+toolbar.height())+'px',
						'z-index':defaults.z_index});
				switch (defaults.a_popout[2])
				{
					case 'text':
						$(this).html(defaults.a_popout[1]);
						break;
					case 'image':
						$('img',$(this)).attr('src',defaults.a_popout[1]);
						break;
					default:
						$(this).html(defaults.a_popout[1]);				
				};
			}
			return false;			
		}
		function resetOL(ol,parent){ //get actual size of ol
			ol.css('position','fixed');			
			var olWidth=ol.width();				
			ol.css('position','relative');				
			<!--[if IE 6]--> 
			ol.css('position','static');
			<!--[end i]--> 
			ol.width((olWidth>=parent.width())?olWidth:'auto');			
		}	
		function onPopOutResize(){
			var newHeight=(win.height()-$(".popout").height())/2;
			var newWidth=(win.width()-$(".popout").width())/2;
			$(".popout").css({'top':newHeight+'px',
						'left':newWidth+'px'});
		}
		function closePopOut(){				
			if($(".popout").length){
				var o=$(".popout");		
				precode=$('.precode',o);	
				ol=$('.precode ol',o);
				resetOL(ol,precode);
				if(o.css('z-index')!=999){
					z_index=o.css('z-index');				
				}						
				modal.hide();
				o.css({'top':'auto',
								'left':'auto',
								'width':'auto',
								'height':'auto',
								'position':'relative',
								'z-index':z_index});
				<!--[if IE 6]--> 
				o.css('position','static');
				precode.css({'width':'auto',
								'height':'auto'							
								});	
				resetOL(ol,precode);	
				switch (defaults.a_popout[2])
				{
					case 'text':
						$('.togglePopout',o).html(defaults.a_popout[0]);
						break;
					case 'image':
						$('img',$('.togglePopout',o)).attr('src',defaults.a_popout[0]);
						break;
					default:
						$('.togglePopout',o).html(defaults.a_popout[0]);				
				};			
				o.removeClass('popout');	
			}
		}
	 };	 
})( jQuery );