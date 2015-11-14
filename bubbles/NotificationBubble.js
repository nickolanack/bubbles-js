
var BubbleMessage=new Class({
	Implements:Events,
	initialize:function(title, description, options){
		var me=this;
		me.options=Object.append({window:window}, options);


		me.element=(function(){
			var el=new Element('div',{'class':'bubble'});
			el.setStyle('top','-300px');
			
			var titleEl=new Element('div',{'class':'title'});
			el.appendChild(titleEl);
			titleEl.innerHTML=title;
			
			if(description!=null){
				var descriptionEl=new Element('div',{'class':'description'});
				el.appendChild(descriptionEl);
				descriptionEl.innerHTML=description;
			
				if(me.options.icon){
					descriptionEl.appendChild(new Asset.image(me.options.icon));
					el.addClass('hasIcon');
				}
			}


			return el;
		})();
		me.options.window.$$('Body')[0].appendChild(me.element);
		if(!me.options.window.BubbleMessages){
			me.options.window.BubbleMessages=[];
		}
		me.options.window.BubbleMessages.push(me);
		me.drop(me.element);


	},
	getPosition:function(){
		var me=this;
		if(me.position)return me.position;
		var bubbles=me.options.window.BubbleMessages.slice(0, me.options.window.BubbleMessages.length);
		var i=bubbles.indexOf(me);

		var last;

		do{
			i--;
			last=bubbles[i];
			if(last){
				if(!me.position){me.position=last.getPosition()+last.element.getSize().y+30;}
				break;
			}

		}while(i>0);
		if(!me.position) me.position=100;

		return me.position;


	},
	drop:function(el){

		var me=this;
		var drop=new Fx.Tween(el,{transition:Fx.Transitions.Expo.easeOut});
		drop.addEvent('onComplete',function(){


			me.options.window.setTimeout(function(){
				me.fadeout(el);
			},1000);

		});
		drop.start('top', me.getPosition());




	},
	fadeout:function(el){
		var me=this;
		var fade=new Fx.Tween(el,{});
		fade.addEvent('onComplete',function(){
			me.options.window.BubbleMessages.splice(me.options.window.BubbleMessages.indexOf(me), 1);
			el.dispose();		
		});
		fade.start('opacity', 0);

	}


});

BubbleMessage.Make=function(title, description, options){
	if(window.parent&&window.parent.BubbleMessage&&window.parent.BubbleMessage!==BubbleMessage){
		window.parent.BubbleMessage.Make(title, description, options);
	}else{
		var t=title.slice(0);
		var d=description!=null?description.slice(0):null;
		var o=options!=null?Object.append({},options):null;

		new BubbleMessage(t, d, o);
	}
};