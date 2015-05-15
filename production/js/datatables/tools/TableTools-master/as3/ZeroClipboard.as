/* Compile using: mxmlc --target-player=10.0.0 ZeroClipboard.as */
package {
	import flash.display.Stage;
	import flash.display.Sprite;
	import flash.display.LoaderInfo;
	import flash.display.StageScaleMode;
	import flash.events.*;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.utils.*;
	import flash.system.System;
	import flash.net.FileReference;
	import flash.net.FileFilter;
 
	public class ZeroClipboard extends Sprite {
		
		private var domId:String = '';
		private var button:Sprite;
		private var clipText:String = 'blank';
		private var fileName:String = '';
		private var action:String = 'copy';
		private var incBom:Boolean = true;
		private var charSet:String = 'utf8';
		
		
		public function ZeroClipboard() {
			// constructor, setup event listeners and external interfaces
			stage.scaleMode = StageScaleMode.EXACT_FIT;
			flash.system.Security.allowDomain("*");
			
			// import flashvars
			var flashvars:Object = LoaderInfo( this.root.loaderInfo ).parameters;
			domId = flashvars.id.split("\\").join("\\\\");
			
			// invisible button covers entire stage
			button = new Sprite();
			button.buttonMode = true;
			button.useHandCursor = true;
			button.graphics.beginFill(0x00FF00);
			button.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			button.alpha = 0.0;
			addChild(button);
			
			button.addEventListener(MouseEvent.CLICK, clickHandler);
			button.addEventListener(MouseEvent.MOUSE_OVER, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseOver', null );
			} );
			button.addEventListener(MouseEvent.MOUSE_OUT, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseOut', null );
			} );
			button.addEventListener(MouseEvent.MOUSE_DOWN, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseDown', null );
			} );
			button.addEventListener(MouseEvent.MOUSE_UP, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseUp', null );
			} );
			
			// External functions - readd whenever the stage is made active for IE
			addCallbacks();
			stage.addEventListener(Event.ACTIVATE, addCallbacks);
			
			// signal to the browser that we are ready
			ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'load', null );
		}
		
		public function addCallbacks (evt:Event = null):void {
			ExternalInterface.addCallback("setHandCursor", setHandCursor);
			ExternalInterface.addCallback("clearText", clearText);
			ExternalInterface.addCallback("setText", setText);
			ExternalInterface.addCallback("appendText", appendText);
			ExternalInterface.addCallback("setFileName", setFileName);
			ExternalInterface.addCallback("setAction", setAction);
			ExternalInterface.addCallback("setCharSet", setCharSet);
			ExternalInterface.addCallback("setBomInc", setBomInc);
		}
		
		
		public function setCharSet(newCharSet:String):void {
			if ( newCharSet == 'UTF16LE' ) {
				charSet = newCharSet;
			} else {
				charSet = 'UTF8';
			}
		}
		
		public function setBomInc(newBomInc:Boolean):void {
			incBom = newBomInc;
		}
		
		public function clearText():void {
			clipText = '';
		}
		
		public function appendText(newText:String):void {
			clipText += newText;
		}
		
		public function setText(newText:String):void {
			clipText = newText;
		}
		
		public function setFileName(newFileName:String):void {
			fileName = newFileName;
		}
		
		public function setAction(newAction:String):void {
			action = newAction;
		}
		
		public function setHandCursor(enabled:Boolean):void {
			// control whether the hand cursor is shown on rollover (true)
			// or the default arrow cursor (false)
			button.useHandCursor = enabled;
		}
		
		
		private function clickHandler(event:Event):void {
			var fileRef:FileReference = new FileReference();
			fileRef.addEventListener(Event.COMPLETE, saveComplete);
			
			if ( action == "save" ) {
				/* Save as a file */
				if ( charSet == 'UTF16LE' ) {
					fileRef.save( strToUTF16LE(clipText), fileName );
				} else {
					fileRef.save( strToUTF8(clipText), fileName );
				}
			} else if ( action == "pdf" ) {
					fileRef.save( "This instance of ZeroClipboard is not configured for PDF export. "+
						"Please use the PDF export version.", fileName+".txt" );
			} else {
				/* Copy the text to the clipboard. Note charset and BOM have no effect here */
				System.setClipboard( clipText );
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'complete', clipText );
			}
		}
		
		
		private function saveComplete(event:Event):void {
			ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'complete', clipText );
		}
		
		
		private function getProp( prop:String, opts:Array ):String
		{
			var i:int, iLen:int;
			for ( i=0, iLen=opts.length ; i<iLen ; i++ )
			{
				if ( opts[i].indexOf( prop+":" ) != -1 )
				{
					return opts[i].replace( prop+":", "" );
				}
			}
			return "";
		}
		
		
		/*
		 * Function: strToUTF8
		 * Purpose:  Convert a string to the output utf-8
		 * Returns:  ByteArray
		 * Inputs:   String
		 */
		private function strToUTF8( str:String ):ByteArray {
			var utf8:ByteArray = new ByteArray();
			
			/* BOM first */
			if ( incBom ) {
				utf8.writeByte( 0xEF );
				utf8.writeByte( 0xBB );
				utf8.writeByte( 0xBF );
			}
			utf8.writeUTFBytes( str );
			
			return utf8;
		}
		
		
		/*
		 * Function: strToUTF16LE
		 * Purpose:  Convert a string to the output utf-16
		 * Returns:  ByteArray
		 * Inputs:   String
		 * Notes:    The fact that this function is needed is a little annoying. Basically, strings in
		 *   AS3 are UTF-16 (with surrogate pairs and everything), but characters which take up less
		 *   than 8 bytes appear to be stored as only 8 bytes. This function effective adds the 
		 *   padding required, and the BOM
		 */
		private function strToUTF16LE( str:String ):ByteArray {
			var utf16:ByteArray = new ByteArray();
			var iChar:uint;
			var i:uint=0, iLen:uint = str.length;
			
			/* BOM first */
			if ( incBom ) {
				utf16.writeByte( 0xFF );
				utf16.writeByte( 0xFE );
			}
			
			while ( i < iLen ) {
				iChar = str.charCodeAt(i);
				
				if ( iChar < 0xFF ) {
					/* one byte char */
					utf16.writeByte( iChar );
					utf16.writeByte( 0 );
				} else {
					/* two byte char */
					utf16.writeByte( iChar & 0x00FF );
					utf16.writeByte( iChar >> 8 );
				}
				
				i++;
			}
			
			return utf16;
		}
	}
}
