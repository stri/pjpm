/**
 * easyTemplate模板
 * @authors Stri (stri.vip@gmail.com)
 * @date    2013-10-07 15:10:59
 * @version $Id$
 */
define(function(module){
	var easyTemplate = function(s,d){
		if(!s){return '';}
		if(s!==easyTemplate.template){
			easyTemplate.template = s;
			easyTemplate.aStatement = easyTemplate.parsing(easyTemplate.separate(s));
		}
		var aST = easyTemplate.aStatement;
		var process = function(d2){
			if(d2){d = d2;}
			return arguments.callee;
		};
		process.toString = function(){
			return (new Function(aST[0],aST[1]))(d);
		};
		return process;
	};
	easyTemplate.separate = function(s){
		var r = /\\'/g;
		var sRet = s.replace(/(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g,function(a,b,c,d,e,f,g,h){
			if(b){return '{|}'+(c?'-':'+')+d+'{|}';}
			if(e){return '\\\'';}
			if(f){return '';}
			if(g){return '\'+('+h.replace(r,'\'')+')+\'';}
		});
		return sRet;
	};
	easyTemplate.parsing = function(s){
		var mName,vName,sTmp,aTmp,sFL,sEl,aList,aStm = ['var aRet = [];'];
		aList = s.split(/\{\|\}/);
		var r = /\s/;
		while(aList.length){
			sTmp = aList.shift();
			if(!sTmp){continue;}
			sFL = sTmp.charAt(0);
			if(sFL!=='+'&&sFL!=='-'){
				sTmp = '\''+sTmp+'\'';aStm.push('aRet.push('+sTmp+');');
				continue;
			}
			aTmp = sTmp.split(r);
			switch(aTmp[0]){
				case '+et':mName = aTmp[1];vName = aTmp[2];aStm.push('aRet.push("<!--'+mName+' start--\>");');break;
				case '-et':aStm.push('aRet.push("<!--'+mName+' end--\>");');break;
				case '+if':aTmp.splice(0,1);aStm.push('if'+aTmp.join(' ')+'{');break;
				case '+elseif':aTmp.splice(0,1);aStm.push('}else if'+aTmp.join(' ')+'{');break;
				case '-if':aStm.push('}');break;
				case '+else':aStm.push('}else{');break;
				case '+list':aStm.push('if('+aTmp[1]+'.constructor === Array){with({i:0,l:'+aTmp[1]+'.length,'+aTmp[3]+'_index:0,'+aTmp[3]+':null}){for(i=l;i--;){'+aTmp[3]+'_index=(l-i-1);'+aTmp[3]+'='+aTmp[1]+'['+aTmp[3]+'_index];');break;
				case '-list':aStm.push('}}}');break;
				default:break;
			}
		}
		aStm.push('return aRet.join("");');
		return [vName,aStm.join('')];
	};

	module.exports = easyTemplate;
});