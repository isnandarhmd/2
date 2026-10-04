jQuery( function( $ ) {

	var whoisTexts = new Array();
 
 	/**
 	 * Class to init client side javascript and html.
 	 */
	$.fn.wp24_domain_check = function( settings ) {
		// append id to use domaincheck multiple times
		var id = settings.id;
		var recaptcha;
		var recaptchaId;
		// queue for gradual loading
		var checkQueue = [];
		var checkQueueLength;
		var checkQueueQueried;
		var checkCount;
		var checkCountFree;
		var showNoResultsMessage;
		
		// show modal window with whois information
		window.showWhoisInfo = function( id, tld ) {
			$( '#whois-info' ).remove();
			var whoisInfo = $(
				'<div id="whois-info" class="whois-info">' +
				'<pre>' + whoisTexts[ id ][ tld ] + '</pre>' +
				'</div>'
			);
			whoisInfo.appendTo(document.body);
			$( '#whois-info' ).modal();
		}

		// disable check all and whois link in whois mode
		if ( 'whois' == settings.mode ) {
			settings.checkAll = false;
			settings.multicheck = false;
			settings.showWhois = false;
		}

		// html form
		var htmlForm = '';
		if ( settings.htmlForm )
			htmlForm += '<form action="#" method="post" id="dc-form-' + id + '">';
		else
			htmlForm += '<div class="dc-form">';
		htmlForm += '<div>';
		if ( '' !== settings.fieldLabel )
			htmlForm += '<span>' + settings.fieldLabel + '&nbsp;</span>';
		switch ( settings.selectionType ) {
			case 'dropdown':
				// textfield for domain and select for tld
				htmlForm += '<input type="text" name="' + settings.fieldnameDomain + '" id="dc-domain-' + id + '"' +
					' placeholder="' + settings.fieldPlaceholder + '" style="width: ' + settings.fieldWidth + '"' +
					( '' == settings.textInvalidField.trim() ? ' pattern="^[^@_.\\/\\\\<>]{1,63}$"' : '' ) +
					( '' == settings.textEmptyField.trim() ? ' required' : '' ) + '>';
				if ( ! settings.dotInSelect )
					htmlForm += '<span class="dot">.</span>';
				htmlForm += '<select name="' + settings.fieldnameTld + '" id="dc-tld-' + id + '">';
				var tlds = settings.tlds.split( ',' );
				$.each ( tlds, function( index, item ) {
					// option group
					if ( '[' == item.trim().charAt( 0 ) )
						return;
					htmlForm += '<option value="' + item.trim() + '"' + 
						( 0 == index && ! settings.checkAllDefault ? ' selected' : '' ) + '>' + ( settings.dotInSelect ? '.' : '' ) + item.trim() + '</option>';
				} );
				if ( settings.checkAll && tlds.length > 1 ) {
					htmlForm += '<option disabled>-----</option>';
					htmlForm += '<option value="all"' + ( settings.checkAllDefault ? ' selected' : '' ) + '>' + settings.checkAllLabel + '</option>';
				}
				htmlForm += '</select>';
				break;
			case 'grouped':
				// textfield for domain and select for tld
				htmlForm += '<input type="text" name="' + settings.fieldnameDomain + '" id="dc-domain-' + id + '"' +
					' placeholder="' + settings.fieldPlaceholder + '" style="width: ' + settings.fieldWidth + '"' +
					( '' == settings.textInvalidField.trim() && ! settings.multicheck ? ' pattern="^[^@_.\\/\\\\<>]{1,63}$"' : '' ) +
					( '' == settings.textEmptyField.trim() ? ' required' : '' ) + '>';
				if ( ! settings.dotInSelect )
					htmlForm += '<span class="dot">.</span>';
				htmlForm += '<select name="' + settings.fieldnameTld + '" id="dc-tld-' + id + '" style="width: 100px">';
				var tlds = settings.tlds.split( ',' );
				var optgroupOpened = false;
				$.each ( tlds, function( index, item ) {
					// option group
					if ( '[' == item.trim().charAt( 0 ) ) {
						var label = item.trim().substring( 1, item.trim().length - 1 );
						htmlForm += optgroupOpened ? '</optgroup>' : '';
						htmlForm += '<optgroup label="' + label + '">';
						optgroupOpened = true;
					}
					else {
						htmlForm += '<option value="' + item.trim() + '"' + 
							( 0 == index && ! settings.checkAllDefault ? ' selected' : '' ) + '>' + ( settings.dotInSelect ? '.' : '' ) + item.trim() + '</option>';
					}
				} );
				if ( settings.checkAll && tlds.length > 1 ) {
					htmlForm += optgroupOpened ? '</optgroup>' : '';
					htmlForm += '<option disabled>-----</option>';
					htmlForm += '<option value="all"' + ( settings.checkAllDefault ? ' selected' : '' ) + '>' + settings.checkAllLabel + '</option>';
				}
				htmlForm += '</select>';
				break;
			case 'freetext':
			case 'unlimited':
				// textfield for domain and tld
				htmlForm += '<input type="text" name="' + settings.fieldnameDomain + '" id="dc-domain-' + id + '"' +
					' placeholder="' + settings.fieldPlaceholder + '" style="width: ' + settings.fieldWidth + '"' +
					( '' == settings.textInvalidField.trim() && ! settings.multicheck ? ' pattern="^[^@_.\\/\\\\<>]{1,63}(\\.[a-zA-Z0-9\\-]{2,})?(\\.[a-zA-Z0-9]{2,})?$"' : '' ) +
					( '' == settings.textEmptyField.trim() ? ' required' : '' ) + '>';
				break;
		}
		if ( settings.htmlForm )
			htmlForm += '<input type="submit" value="' + settings.textButton + '" id="dc-submit-' + id + '">';
		else
			htmlForm += '<button type="button" id="dc-submit-' + id + '">' + settings.textButton + '</button>';
		// add a hidden spinner button (input element style can't be changed)
		if ( 'gradual_loading' == settings.displayType )
			htmlForm += '<button type="button" id="dc-spinner-' + id + '" class="dc-spinner" style="display: none;">' + settings.textButton + '</button>';
		htmlForm += '</div>';

		// captcha
		if ( ! settings.recaptcha ) {
			settings.recaptcha = {
				type: 'none'
			};
		}
		switch ( settings.recaptcha.type ) {
			case 'v2_check':
				htmlForm += '<br>';
				htmlForm +=
					'<div class="g-recaptcha" ' +
					'data-sitekey="' + settings.recaptcha.siteKey + '" ' +
					'data-theme="' + settings.recaptcha.theme + '" ' +
					'data-size="' + settings.recaptcha.size + '"' +
					'></div>';
				break;
			case 'v2_badge':
				htmlForm +=
					'<div class="g-recaptcha" ' +
					'data-sitekey="' + settings.recaptcha.siteKey + '" ' +
					'data-theme="' + settings.recaptcha.theme + '" ' +
					'data-size="invisible" ' +
					'data-badge="' + settings.recaptcha.position + '" ' +
					'data-callback="onFormSubmit"' +
					'></div>';

					window.onFormSubmit = function ( token ) {
						formSubmit();
					}
				break;
			case 'v3':
				htmlForm += '<div id="g-recaptcha"></div>';
				grecaptcha.ready( function() {
					recaptchaId = grecaptcha.render( 'g-recaptcha', {
						sitekey: settings.recaptcha.siteKey,
						theme: settings.recaptcha.theme,
						size: 'invisible',
						badge: settings.recaptcha.position,
					} );
				} );
				break;
			case 'turnstile':
				htmlForm += '<br>';
				htmlForm += '<div id="cf-turnstile"></div>';

				function turnstileRender() {
					return turnstile.render( '#cf-turnstile', {
						sitekey: settings.recaptcha.siteKey,
						theme: settings.recaptcha.theme,
						size: settings.recaptcha.size,
						execution: 'execute',
						appearance: 'execute',
						callback: function ( token ) {
							formSubmit( token );
						},
					} );
				}

				window.onload = function () {
					recaptchaId = turnstileRender();
				};
				break;
		}

		if ( settings.htmlForm )
			htmlForm += '</form>';
		else
			htmlForm += '</div>';
		htmlForm += '<br>';
		if ( ! settings.hideResults )
			htmlForm += '<div id="dc-result-' + id + '"></div>';
		this.html( htmlForm );

		if ( 'gradual_loading' == settings.displayType ) {
			// get font color and set it as border color
			var borderColor = $( '#dc-submit-' + id ).css( 'color' ) || '#fff';
			$( '.dc-spinner' ).get(0).style.setProperty('--border-color', borderColor);
		}

		// form submit
		var submitElement = '#dc-form-' + id;
		var submitEvent = 'submit';

		if ( ! settings.htmlForm ) {
			// button click
			var submitElement = '#dc-submit-' + id;
			var submitEvent = 'click';
		}

		$( submitElement ).on( submitEvent, function( e ) {
			e.preventDefault();

			// custom empty field message
			if ( '' != settings.textEmptyField.trim() && '' === $( '#dc-domain-' + id ).val().replace( / /g, '' ) ) {
				if ( 'overlay' == settings.displayType ) {
					// remove result div and readd it as modal overlay
					$( '#dc-result-' + id ).remove();
					var overlay = $( '<div id="dc-result-' + id + '" class="wp24-dc"><span>' + settings.textEmptyField + '</span></div>' );
					overlay.appendTo( document.body );
					$( '#dc-result-' + id ).modal();
				}
				else {
					$( '#dc-result-' + id ).empty();
					$( '#dc-result-' + id ).html( '<span>' + settings.textEmptyField + '</span>' );
				}
				$( '#dc-result-' + id ).addClass( 'empty-field' );
				if ( '' != settings.colorEmptyField )
					$( '#dc-result-' + id + ' span' ).css( 'color', settings.colorEmptyField );
				return;
			}

			// custom invalid field message
			var regex = '^[^@_.\\/\\\\<>]{1,63}$';
			if ( 'freetext' == settings.selectionType || 'unlimited' == settings.selectionType )
				regex = '^[^@_.\\/\\\\<>]{1,63}(\\.[a-zA-Z0-9\\-]{2,})?(\\.[a-zA-Z0-9]{2,})?$';
			if ( '' != settings.textInvalidField.trim() && ! $( '#dc-domain-' + id ).val().match( regex ) && ! settings.multicheck ) {
				if ( 'overlay' == settings.displayType ) {
					// remove result div and readd it as modal overlay
					$( '#dc-result-' + id ).remove();
					var overlay = $( '<div id="dc-result-' + id + '" class="wp24-dc"><span>' + settings.textInvalidField + '</span></div>' );
					overlay.appendTo( document.body );
					$( '#dc-result-' + id ).modal();
				}
				else {
					$( '#dc-result-' + id ).empty();
					$( '#dc-result-' + id ).html( '<span>' + settings.textInvalidField + '</span>' );
				}
				$( '#dc-result-' + id ).addClass( 'invalid-field' );
				if ( '' != settings.colorInvalidField )
					$( '#dc-result-' + id + ' span' ).css( 'color', settings.colorInvalidField );
				return;
			}

			if ( 'v2_badge' == settings.recaptcha.type ) {
				grecaptcha.execute();
				return;
			}
			else if ( 'v3' == settings.recaptcha.type ) {
				grecaptcha.execute( recaptchaId, { action: 'wp24_domaincheck' } ).then( function( token ) {
					formSubmit( token );
				} );
				return;
			}
			else if ( 'turnstile' == settings.recaptcha.type ) {
				// if render in onload failed, try again
				if ( ! recaptchaId )
					recaptchaId = turnstileRender();
				turnstile.reset( recaptchaId );
				turnstile.execute( recaptchaId );
				return;
			}

			formSubmit();
		} );

		function formSubmit( e ) {
			if ( 'gradual_loading' == settings.displayType ) {
				// hide submit button, show spinner button
				$( '#dc-submit-' + id ).hide();
				$( '#dc-spinner-' + id ).show();
			}
			else {
				// disable button for 2 seconds
				var btn = $( '#dc-submit-' + id );
				btn.prop( 'disabled', true );
				btn.css( 'cursor', 'wait' );
				window.setTimeout( function() {
					btn.prop( 'disabled', false );
					btn.css( 'cursor', 'pointer' );
				}, 2000 );
			}

			$( ':focus' ).blur();
			$( '#dc-result-' + id ).empty();

			var inputString = $( '#dc-domain-' + id ).val().replace( /\s|https?:\/\/(www.)?/g, '' ).toLowerCase();
			var domains = [];
			if ( settings.multicheck && -1 !== inputString.indexOf( ',' ) ) {
				// multi domain check
				$.each ( inputString.split( ',' ), function( index, item ) {
					domains.push( {
						domain: item,
						tld: '',
					} );
				} );
			}
			else {
				// single domain check
				if ( -1 !== inputString.indexOf( ',' ) )
					inputString = inputString.split( ',' )[0];

				domains.push( {
					domain: inputString,
					tld: '',
				} );
			}

			// alternative suggestions
			if ( '' !== settings.prefixes || '' !== settings.suffixes ) {
				var domainsWithSuggestions = [];
				$.each ( domains, function( index, item ) {
					var domain = item.domain;
					var tld = '';
					if ( -1 !== ['freetext', 'unlimited'].indexOf( settings.selectionType ) ) {
						var domainTld = domain;
						domain = domainTld.split( '.', 1 )[0];
						tld = domainTld.slice( domain.length );
					}

					domainsWithSuggestions.push( {
						domain: domain + tld,
						tld: '',
					} );
					$.each ( settings.prefixes.split( ',' ), function( sIndex, sItem ) {
						domainsWithSuggestions.push( {
							domain: sItem.trim().toLowerCase() + domain + tld,
							tld: '',
						} );
					} );
					$.each ( settings.suffixes.split( ',' ), function( sIndex, sItem ) {
						domainsWithSuggestions.push( {
							domain: domain + sItem.trim().toLowerCase() + tld,
							tld: '',
						} );
					} );
				} );
				domains = domainsWithSuggestions;
			}

			var error = false;
			$.each ( domains, function( index, item ) {
				switch ( settings.selectionType ) {
					case 'dropdown':
					case 'grouped':
						item.tld = $( '#dc-tld-' + id ).val().replace( / /g, '' ).toLowerCase();
						break;
					case 'freetext':
						var domainTld = item.domain;
						item.domain = domainTld.split( '.', 1 )[0];
						item.tld = domainTld.slice( item.domain.length + 1 );

						// if no tld is specified check all testable tlds
						if ( '' === item.tld && settings.checkAll ) {
							item.tld = 'all';
							break;
						}
						else if ( '' === item.tld ) {
							if ( settings.tlds.split( ',' ).length == 1 ) {
								// only one tld defined
								item.tld = settings.tlds;
								break;
							}
							else {
								$( '#dc-result-' + id ).empty();
								$( '#dc-result-' + id ).html( '<span>' + settings.textTldMissing + '</span>' );
								if ( '' != settings.colorTldMissing )
									$( '#dc-result-' + id + ' span' ).css( 'color', settings.colorTldMissing );
								error = true;
								return false;
							}
						}

						// check if tld is supported
						var supportedTlds = settings.tlds.split( ',' ).filter( function( s ) {
							if ( '[' == s.trim().charAt( 0 ) )
								return false;
							return true;
						} ).map( function( s ) {
							return s.trim();
						} );
						if ( -1 == supportedTlds.indexOf( item.tld ) ) {
							$( '#dc-result-' + id ).empty();
							$( '#dc-result-' + id ).html( '<span>' + settings.textUnsupported.replace( '[tld]', item.tld ) + '</span>' );
							if ( '' != settings.colorUnsupported )
								$( '#dc-result-' + id + ' span' ).css( 'color', settings.colorUnsupported );
							error = true;
							return false;
						}
						break;
					case 'unlimited':
						var domainTld = item.domain;
						item.domain = domainTld.split( '.', 1 )[0];
						item.tld = domainTld.slice( item.domain.length + 1 );

						if ( '' === item.tld ) {
							$( '#dc-result-' + id ).empty();
							$( '#dc-result-' + id ).html( '<span>' + settings.textTldMissing + '</span>' );
							if ( '' != settings.colorTldMissing )
								$( '#dc-result-' + id + ' span' ).css( 'color', settings.colorTldMissing );
							error = true;
							return false;
						}
						break;
				}
				
				var tlds = [ item.tld ];
				if ( 'all' == item.tld && 'unlimited' != settings.selectionType ) {
					tlds = settings.tlds.split( ',' ).filter( function( s ) {
						if ( '[' == s.trim().charAt( 0 ) )
							return false;
						return true;
					} ).map( function( s ) {
						return s.trim();
					} );
				}
				item.tlds = tlds;
			} );
			if ( error ) {
				if ( 'gradual_loading' == settings.displayType ) {
					// hide spinner button, show submit button
					$( '#dc-spinner-' + id ).hide();
					$( '#dc-submit-' + id ).show();
				}
				return;
			}

			var htmlResult = '';
			htmlResult += '<div class="table">';

			if ( 'gradual_loading' == settings.displayType )
				checkQueue = [];
			$.each ( domains, function( index, item ) {
				$.each ( item.tlds, function( index, tld ) {
					if ( 'gradual_loading' == settings.displayType )
						checkQueue.push( item.domain + '.' + tld );
					else
						htmlResult += buildTableRow( item.domain, tld );
				} );
			} );
			
			if ( 3 == settings.addToCartBehaviour ) {
				htmlResult += '<div class="table-row">';
				htmlResult += '<div class="table-cell table-cell-checkbox"><input type="checkbox" class="dc-check-all"></div>';
				htmlResult += '<div class="table-cell">' + settings.checkAllLabel + '</div>';
				htmlResult += '<br>';
				htmlResult += '</div>';
			}
			htmlResult += '</div>';
			if ( 'gradual_loading' == settings.displayType ) {
				if ( settings.excludeRegistered && '' != settings.textNoResults )
					htmlResult += '<p class="dc-no-results" style="display: none;">' + settings.textNoResults + '</p>';
				if ( settings.displayLimit )
					htmlResult += '<p style="display: none;"><button type="button" class="dc-load-more" href="javascript: void(0);">' + settings.textLoadMore + '</button></p>'
			}
			if ( 3 == settings.addToCartBehaviour )
				htmlResult += '<p><button type="button" class="dc-add-to-cart" href="javascript: void(0);">' + settings.addToCartText + '</button></p>';
			if ( 'whois' == settings.mode )
				htmlResult += '<div id="whois-info-' + id + '" class="whois-info-inline"></div>';
			
			if ( 'overlay' == settings.displayType ) {
				// remove result div and readd it as modal overlay
				$( '#dc-result-' + id ).remove();
				var overlay = $( '<div id="dc-result-' + id + '" class="wp24-dc">' + htmlResult + '</div>' );
				overlay.appendTo( document.body );
				$( '#dc-result-' + id ).modal();
			}
			else
				$( '#dc-result-' + id ).html( htmlResult );

			// captcha
			recaptcha = '';
			switch ( settings.recaptcha.type ) {
				case 'v2_check':
				case 'v2_badge':
					recaptcha = grecaptcha.getResponse();
					grecaptcha.reset();
					break;
				case 'v3':
				case 'turnstile':
					recaptcha = e;
					break;
			}

			if ( 'gradual_loading' == settings.displayType ) {
				checkQueueLength = checkQueue.length;
				checkQueueQueried = 0;
				checkCount = 0;
				checkCountFree = 0;
				showNoResultsMessage = true;
				processQueue( settings.displayLimit ? settings.displayLimit : checkQueueLength );
			}
			else {
				$.each ( domains, function( index, item ) {
					$.each ( item.tlds, function( index, tld ) {
						ajaxWhoisQuery( item.domain, tld );
					} );
				} );
			}
		}

		function ajaxWhoisQuery( domain, tld ) {
			var data = {
				action: 'whois_query',
				domain: domain,
				tld: tld,
				recaptcha: recaptcha
			}

			// execute whois query as ajax request
			$.ajax( {
				url: settings.ajaxurl,
				method: 'post',
				data: data,
				dataType: 'json',
				success: function( response ) {
					if ( ! response ) {
						// request did not provide a response
						var tld = /[\?&]tld=([^&#]+)/.exec( this.data )[1];
						var domain = /[\?&]domain=([^&#]+)/.exec( this.data )[1];
						var classname = '.dc-tld-' + id + '-' + tld;
						if ( settings.multicheck )
							classname = '.dc-tld-' + id + '-' + domain.replace( /[^a-zA-Z0-9-]/g, '' ) + '-' + tld;

						$( classname ).html( settings.textError );
						if ( '' != settings.colorError )
							$( classname ).css( 'color', settings.colorError );
						$( classname ).parent().addClass( 'error' );

						if ( 'gradual_loading' == settings.displayType )
							verifyQueue( domain + '.' + tld, 'error' );

						return;
					}

					if ( 'undefined' == typeof response.price )
						response.price = '';
					if ( 'undefined' == typeof response.link )
						response.link = '';

					function removeTags( text ) {
						text = text.replace( /\[link\]/g, '' );
						text = text.replace( /\[link newpage\]/g, '' );
						text = text.replace( /\[\/link\]/g, '' );
						text = text.replace( /\[button\]/g, '' );
						text = text.replace( /\[button newpage\]/g, '' );
						text = text.replace( /\[\/button\]/g, '' );

						return text;
					}

					// set result text and color depending on whois status
					var classname = '.dc-tld-' + id + '-' + response.tld.replace( '.', '' );
					if ( settings.multicheck )
						classname = '.dc-tld-' + id + '-' + response.domain.replace( /[^a-zA-Z0-9-]/g, '' ) + '-' + response.tld.replace( '.', '' );
					switch ( response.status ) {
						case 'error':
						case 'unauthorized':
							$( classname ).html( settings.textError );
							if ( '' != settings.colorError )
								$( classname ).css( 'color', settings.colorError );
							break;
						case 'invalid':
							$( classname ).html( settings.textInvalid );
							if ( '' != settings.colorInvalid )
								$( classname ).css( 'color', settings.colorInvalid );
							break;
						case 'limit':
							$( classname ).html( settings.textLimit );
							if ( '' != settings.colorLimit )
								$( classname ).css( 'color', settings.colorLimit );
							break;
						case 'whoisserver':
							if ( 'unlimited' == settings.selectionType ) {
								// show unsupported message with unlimited selection type
								$( '.table-cell-domain').empty();
								$( classname ).html( settings.textUnsupported.replace( '[tld]', response.tld ) );
								if ( '' != settings.colorUnsupported )
									$( classname ).css( 'color', settings.colorUnsupported );
							}
							else {
								$( classname ).html( settings.textWhoisserver );
								if ( '' != settings.colorError )
									$( classname ).css( 'color', settings.colorError );
							}
							break;
						case 'registered':
							$( classname ).html( settings.textRegistered );
							if ( '' != settings.colorRegistered )
								$( classname ).css( 'color', settings.colorRegistered );

							if ( settings.linkRegistered ) {
								$( classname + '-domain' ).html(
									'<a href="http://' + response.domain + '.' + response.tld + '"' +
									' target="_blank" rel="nofollow">' +
									response.domain + '.<strong>' + response.tld + '</a>'
								);
							}

							// add price and transfer link
							if ( '' != response.price || '' != response.link ) {
								var textTransfer = '<div class="table-cell table-cell-transfer">' + settings.textTransfer + '</div>';
								if ( '' != response.price )
									textTransfer = textTransfer.replace( /\[price\]/g, response.price );
								else
									textTransfer = textTransfer.replace( /\[price\]/g, '' );
								if ( '' != response.link ) {
									if ( 3 == settings.addToCartBehaviour ) {
										$( classname + '-checkbox input' ).prop( 'disabled', false );
										$( classname + '-checkbox input' ).attr( 'data-product-id', response.link );												
										$( classname + '-checkbox input' ).attr( 'data-domain', response.domain + '.' + response.tld );
										textTransfer = removeTags( textTransfer );
									}
									else {
										var link = response.link.replace( /\[domain\]/g, response.domain ).replace( /\[tld\]/g, response.tld );
										if ( 0 == settings.addToCartBehaviour ) {
											textTransfer = textTransfer.replace( /\[link\]/g, '<a href="' + link + '">' );
											textTransfer = textTransfer.replace( /\[link newpage\]/g, '<a href="' + link + '" target="_blank">' );
											textTransfer = textTransfer.replace( /\[button\]/g, '<a href="' + link + '"><button type="button">' );
											textTransfer = textTransfer.replace( /\[button newpage\]/g, '<a href="' + link + '" target="_blank"><button type="button">' );
										}
										else {
											textTransfer = textTransfer.replace( /\[link\]/g, '<a class="dc-add-to-cart" href="javascript: void(0);" ' +
												'data-product-id="' + response.link + '" ' + 
												'data-domain="' + response.domain + '.' + response.tld + '" ' +
												'data-transfer="true">' );
											textTransfer = textTransfer.replace( /\[button\]/g, '<button type="button" class="dc-add-to-cart" href="javascript: void(0);" ' +
												'data-product-id="' + response.link + '" ' + 
												'data-domain="' + response.domain + '.' + response.tld + '" ' +
												'data-transfer="true">' );
										}
										textTransfer = textTransfer.replace( /\[\/link\]/g, '</a>' );
										textTransfer = textTransfer.replace( /\[\/button\]/g, '</button></a>' );
									}
								}
								else
									textTransfer = removeTags( textTransfer );
								$( classname ).after( textTransfer );
							}
							break;
						case 'available':
						case 'available_probably':
							if ( 'available' == response.status ) {
								$( classname ).html( settings.textAvailable );
								if ( '' != settings.colorAvailable )
									$( classname ).css( 'color', settings.colorAvailable );
							}
							else {
								$( classname ).html( settings.unsupported.text );
								if ( '' != settings.unsupported.color )
									$( classname ).css( 'color', settings.unsupported.color );
							}

							// add price and purchase link
							if ( '' != response.price || '' != response.link ) {
								var textPurchase = '<div class="table-cell table-cell-purchase">' + settings.textPurchase + '</div>';
								if ( '' != response.price )
									textPurchase = textPurchase.replace( /\[price\]/g, response.price );
								else
									textPurchase = textPurchase.replace( /\[price\]/g, '' );
								if ( '' != response.link ) {
									if ( 3 == settings.addToCartBehaviour ) {
										$( classname + '-checkbox input' ).prop( 'disabled', false );
										$( classname + '-checkbox input' ).attr( 'data-product-id', response.link );												
										$( classname + '-checkbox input' ).attr( 'data-domain', response.domain + '.' + response.tld );
										textPurchase = removeTags( textPurchase );
									}
									else {
										var link = response.link.replace( /\[domain\]/g, response.domain ).replace( /\[tld\]/g, response.tld );
										if ( 0 == settings.addToCartBehaviour ) {
											textPurchase = textPurchase.replace( /\[link\]/g, '<a href="' + link + '">' );
											textPurchase = textPurchase.replace( /\[link newpage\]/g, '<a href="' + link + '" target="_blank">' );
											textPurchase = textPurchase.replace( /\[button\]/g, '<a href="' + link + '"><button type="button">' );
											textPurchase = textPurchase.replace( /\[button newpage\]/g, '<a href="' + link + '" target="_blank"><button type="button">' );
										}
										else {
											textPurchase = textPurchase.replace( /\[link\]/g, '<a class="dc-add-to-cart" href="javascript: void(0);" ' +
												'data-product-id="' + response.link + '" ' + 
												'data-domain="' + response.domain + '.' + response.tld + '">' );
											textPurchase = textPurchase.replace( /\[button\]/g, '<button type="button" class="dc-add-to-cart" href="javascript: void(0);" ' +
												'data-product-id="' + response.link + '" ' + 
												'data-domain="' + response.domain + '.' + response.tld + '">' );
										}
										textPurchase = textPurchase.replace( /\[\/link\]/g, '</a>' );
										textPurchase = textPurchase.replace( /\[\/button\]/g, '</button></a>' );
									}
								}
								else
									textPurchase = removeTags( textPurchase );
								$( classname ).after( textPurchase );
							}

							break;
						case 'recaptcha':
							$( '#dc-result-' + id ).empty();
							$( '#dc-result-' + id ).html( '<span>' + settings.recaptcha.text + '</span>' );
							if ( '' != settings.recaptcha.color )
								$( '#dc-result-' + id + ' span' ).css( 'color', settings.recaptcha.color );
							break;
					}
					$( classname ).parent().addClass( response.status );

					if ( 'available_probably' == response.status && settings.unsupported.verify && '' != $.trim( response.text ) ) {
						var link = response.text.replace( '[domain]', response.domain ).replace( '[tld]', response.tld );
						$( classname + '-whois' ).html( '(<a href="' + link + '">' + settings.unsupported.verifyText + '</a>)' );
					}
					else if ( settings.showWhois && '' != $.trim( response.text ) ) {
						$( classname + '-whois' ).html( '(<a href="javascript: void(0);" ' + 
							'onclick="showWhoisInfo(\'' + id + '\', \'' + response.tld + '\'); return false;">' + settings.textWhois + '</a>)' );
						if ( ! whoisTexts[ id ] )
							whoisTexts[ id ] = new Array();
						whoisTexts[ id ][ response.tld ] = response.text;
					}
					else if ( 'whois' == settings.mode && '' != $.trim( response.text ) ) {
						$( '#whois-info-' + id ).html( '<pre>' + response.text + '</pre>' );
					}

					if ( 'gradual_loading' == settings.displayType ) {
						if ( ! settings.excludeRegistered || 'registered' != response.status )
							$( classname ).parent().fadeIn();
						else
							$( classname ).parent().remove();
						verifyQueue( response.domain + '.' + response.tld, response.status );
					}
				},
				error: function ( jqXHR, textStatus, errorThrown ) {
					// ajax request failed
					var tld = /[\?&]tld=([^&#]+)/.exec( this.data )[1];
					var domain = /[\?&]domain=([^&#]+)/.exec( this.data )[1];
					var classname = '.dc-tld-' + id + '-' + tld;
					if ( settings.multicheck )
						classname = '.dc-tld-' + id + '-' + domain.replace( /[^a-zA-Z0-9-]/g, '' ) + '-' + tld;
					$( classname ).html( settings.textError );
					if ( '' != settings.colorError )
						$( classname ).css( 'color', settings.colorError );
					$( classname ).parent().addClass( 'error' );

					if ( 'gradual_loading' == settings.displayType ) {
						$( classname ).parent().fadeIn();
						verifyQueue( domain + '.' + tld, 'error' );
					}
				}
			} );
		}

		// build table row with placeholders for the query results
		function buildTableRow( domain, tld ) {
			var classname = 'dc-tld-' + id + '-' + tld.replace( '.', '' );
			if ( settings.multicheck )
				classname = 'dc-tld-' + id + '-' + domain.replace( /[^a-zA-Z0-9-]/g, '' ) + '-' + tld.replace( '.', '' );
			var htmlTable = '<div class="table-row"' + ( 'gradual_loading' == settings.displayType ? ' style="display: none;"' : '' ) + '>';
			if ( 3 == settings.addToCartBehaviour )
				htmlTable += '<div class="table-cell table-cell-checkbox ' + classname + '-checkbox"><input type="checkbox" disabled></div>';
			htmlTable += '<div class="table-cell table-cell-domain ' + classname + '-domain">' + domain + '.<strong>' + tld + '</strong></div>';
			htmlTable += '<div class="table-cell table-cell-status ' + classname + '">' +
				'<img src="' + settings.path + 'assets/images/loading.gif"></div>';
			if ( settings.showWhois || settings.unsupported.enabled )
				htmlTable += '<div class="table-cell table-cell-whois ' + classname + '-whois"></div>';
			htmlTable += '<br>';
			htmlTable += '</div>';

			return htmlTable;
		}

		function processQueue( limit ) {
			var htmlResult = '';
			for (var i = 0; i < limit && checkQueue.length > 0; i++) {
				var checkQueueItem = checkQueue.shift();
				var domain = checkQueueItem.split( '.', 1 )[0];
				var tld = checkQueueItem.slice( domain.length + 1 );

				htmlResult += buildTableRow( domain, tld );
				ajaxWhoisQuery( domain, tld );
				checkQueueQueried++;
			}
			$( '#dc-result-' + id + ' .table' ).append( htmlResult );
		}

		function verifyQueue( item, status ) {
			checkCount++;
			if ( settings.excludeRegistered && 'registered' != status )
				checkCountFree++;

			if ( showNoResultsMessage )
				showNoResultsMessage = 'registered' == status;

			if ( checkCount == checkQueueLength ) {
				if ( showNoResultsMessage && settings.excludeRegistered && '' != settings.textNoResults )
					$( '#dc-result-' + id + ' .dc-no-results').show();

				$( '#dc-result-' + id + ' .dc-load-more' ).parent().hide();

				// hide spinner button, show submit button
				$( '#dc-spinner-' + id ).hide();
				$( '#dc-submit-' + id ).show();
			}
			else if ( settings.displayLimit && ( 0 == checkCount % settings.displayLimit || ( settings.excludeRegistered && checkCountFree == settings.displayLimit ) ) ) {
				// display limit reached
				if ( settings.excludeRegistered && checkCountFree < settings.displayLimit ) {
					// display limit not reached with free domains, query more
					processQueue( settings.displayLimit - checkCountFree );
					return;
				}

				if ( showNoResultsMessage && settings.excludeRegistered && '' != settings.textNoResults )
					$( '#dc-result-' + id + ' .dc-no-results').show();
				showNoResultsMessage = true;

				// show load more button
				if ( checkQueue.length > 0 ) {
					$( '#dc-result-' + id + ' .dc-load-more' ).parent().show();
					$( '#dc-result-' + id + ' .dc-load-more' ).removeClass( 'dc-spinner' );
					$( '#dc-result-' + id + ' .dc-load-more' ).prop( 'disabled', false );
				}
				else
					$( '#dc-result-' + id + ' .dc-load-more' ).parent().hide();

				// hide spinner button, show submit button
				$( '#dc-spinner-' + id ).hide();
				$( '#dc-submit-' + id ).show();
			}
			else if ( settings.excludeRegistered && checkCount == checkQueueQueried ) {
				// check count reached query count, load more
				processQueue( settings.displayLimit - checkCountFree );
			}
		}

		if ( settings.addToCartBehaviour > 0 ) {
			// add to cart ajax
			$( document.body ).on( 'click', '.dc-add-to-cart', function( e ) {
				e.preventDefault();

				if ( 3 == settings.addToCartBehaviour ) {
					var button = $( this );
					var dataArray = new Array();
					$( '.table-cell-checkbox input' ).each( function() {
						var $this = $( this );
						if ( $this.is( ':checked' ) && ! $this.is( ':disabled' ) ) {
							var data = {
								product_id: $this.data( 'product-id' ),
								domain: $this.data( 'domain' ),
								transfer: $this.data( 'transfer' ),
							}
							dataArray.push( data );
							$this.prop( 'disabled', true );
						}
					});

					if ( 0 == dataArray.length )
						return;

					// send ajax request
					$.ajax( {
						url: settings.ajaxurl,
						method: 'post',
						data: {
							action: 'add_domain_to_cart',
							type: 'multi',
							data: dataArray,
						},
						success: function( response ) {
							if ( response && ( response.success || response.fragments ) ) {
								button.html( settings.addedToCartText );
								// trigger added to cart event
								if ( response.fragments )
									$( document.body ).trigger( 'added_to_cart', [ response.fragments, response.cart_hash, button ] );
							}
						}
					} );
				}
				else {
					var $this = $( this );
					var data = {
						action: 'add_domain_to_cart',
						product_id: $this.data( 'product-id' ),
						domain: $this.data( 'domain' ),
						transfer: $this.data( 'transfer' ),
					}

					// send ajax request
					$.ajax( {
						url: settings.ajaxurl,
						method: 'post',
						data: data,
						success: function( response ) {
							if ( response && ( response.success || response.fragments ) ) {
								if ( 2 == settings.addToCartBehaviour && settings.customPageLink )
									window.location.href = settings.customPageLink;
								else {
									// disable link / button
									$this.text( settings.addedToCartText );
									$this.removeAttr( 'href' );
									$this.prop( 'disabled', true );
									// trigger added to cart event
									if ( response.fragments )
										$( document.body ).trigger( 'added_to_cart', [ response.fragments, response.cart_hash, $this ] );
								}
							}
							else {
								$this.html( settings.textError );
								if ( '' != settings.colorError )
									$this.css( 'color', settings.colorError );
							}
						},
						error: function ( jqXHR, textStatus, errorThrown ) {
							// ajax request failed
							$this.html( settings.textError );
							if ( '' != settings.colorError )
								$this.css( 'color', settings.colorError );
						}
					} );
				}
			} );

			// check all
			if ( 3 == settings.addToCartBehaviour ) {
				$( document.body ).on( 'change', '.dc-check-all', function( e ) {
					var state = $( this ).is( ':checked' );
					$( '.table-cell-checkbox input' ).each( function() {
						var $this = $( this );
						if ( ! $this.is( ':disabled' ) )
							$this.prop( 'checked', state );
					});
				} );
			}
		}

		if ( 'gradual_loading' == settings.displayType && settings.displayLimit ) {
			$( document.body ).on( 'click', '.dc-load-more', function( e ) {
				e.preventDefault();

				$( '#dc-result-' + id + ' .dc-no-results' ).hide();
				$( '#dc-result-' + id + ' .dc-load-more' ).addClass( 'dc-spinner' );
				$( '#dc-result-' + id + ' .dc-load-more' ).prop( 'disabled', true );
				// hide submit button, show spinner button
				$( '#dc-submit-' + id ).hide();
				$( '#dc-spinner-' + id ).show();

				checkCountFree = 0;
				processQueue( settings.displayLimit );
			} );
		}
	};

} );