/* Compile using: mxmlc --target-player=10.0.0 -static-link-runtime-shared-libraries=true -library-path+=lib ZeroClipboardPdf.as */
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
	
	/* PDF imports */
	import org.alivepdf.pdf.PDF;
	import org.alivepdf.data.Grid;
	import org.alivepdf.data.GridColumn;
	import org.alivepdf.layout.Orientation;
	import org.alivepdf.layout.Size;
	import org.alivepdf.layout.Unit;
	import org.alivepdf.display.Display;
	import org.alivepdf.saving.Method;
	import org.alivepdf.fonts.FontFamily;
	import org.alivepdf.fonts.Style;
	import org.alivepdf.fonts.CoreFont;
	import org.alivepdf.colors.RGBColor;
 
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

			// Validate id to prevent scripting attacks. The id given is an integer
			if ( domId !== parseInt( domId, 10 ).toString() ) {
				throw new Error( 'Invalid DOM id' );
			}
			
			// invisible button covers entire stage
			button = new Sprite();
			button.buttonMode = true;
			button.useHandCursor = true;
			button.graphics.beginFill(0x00FF00);
			button.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			button.alpha = 0.0;
			addChild(button);
			
			button.addEventListener(MouseEvent.CLICK, function(event:Event):void {
				clickHandler(event);
			} );
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
				/* Save as a PDF */
				var pdf:PDF = configPdf();
				fileRef.save( pdf.save( Method.LOCAL ), fileName );
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
		
		
		private function configPdf():PDF
		{
			var
				pdf:PDF,
				i:int, iLen:int,
				splitText:Array    = clipText.split("--/TableToolsOpts--\n"),
				opts:Array         = splitText[0].split("\n"),
				dataIn:Array       = splitText[1].split("\n"),
				aColRatio:Array    = getProp( 'colWidth', opts ).split('\t'),
				title:String       = getProp( 'title', opts ),
				message:String     = getProp( 'message', opts ),
				orientation:String = getProp( 'orientation', opts ),
				size:String        = getProp( 'size', opts ),
				iPageWidth:int     = 0,
				dataOut:Array      = [],
				columns:Array      = [],
				headers:Array,
				y:int = 0;
			
			/* Create the PDF */
			pdf = new PDF( Orientation[orientation.toUpperCase()], Unit.MM, Size[size.toUpperCase()] );
			pdf.setDisplayMode( Display.FULL_WIDTH );
			pdf.addPage();
			iPageWidth = pdf.getCurrentPage().w-20;
			pdf.textStyle( new RGBColor(0), 1 );
			
			/* Add the title / message if there is one */
			pdf.setFont( new CoreFont(FontFamily.HELVETICA), 14 );
			if ( title != "" )
			{
				pdf.writeText(11, title+"\n");
			}
			
			pdf.setFont( new CoreFont(FontFamily.HELVETICA), 11 );
			if ( message != "" )
			{
				pdf.writeText(11, message+"\n");
			}
			
			/* Data setup. Split up the headers, and then construct the columns */
			for ( i=0, iLen=dataIn.length ; i<iLen ; i++ )
			{
				if ( dataIn[i] != "" )
				{
					dataOut.push( dataIn[i].split("\t") );
				}
			}
			headers = dataOut.shift();
			
			for ( i=0, iLen=headers.length ; i<iLen ; i++ )
			{
				columns.push( new GridColumn( " \n"+headers[i]+"\n ", i.toString(), aColRatio[i]*iPageWidth, 'C' ) );
			}
			
			var grid:Grid = new Grid(
				dataOut,                  /* 1. data */
				iPageWidth,               /* 2. width */
				100,                      /* 3. height */
				new RGBColor (0xE0E0E0),  /* 4. headerColor */
				new RGBColor (0xFFFFFF),  /* 5. backgroundColor */
				true,                     /* 6. alternateRowColor */
				new RGBColor ( 0x0 ),     /* 7. borderColor */
				.1,                       /* 8. border alpha */
				null,                     /* 9. joins */
				columns                   /* 10. columns */
			);
			
			pdf.addGrid( grid, 0, y );
			return pdf;
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
