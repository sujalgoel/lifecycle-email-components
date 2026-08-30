// Builds preview/*.html from dist/*.html by substituting the Customer.io
// Liquid tokens with sample data, so the design can be reviewed as a real
// email would render. dist/ stays the deployable artifact with Liquid intact.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SAMPLE = [
	['{{customer.first_name}}', 'Sarah'],
	['{{event.property_name}}', 'The Salt House'],
	['{{event.guests}}', '4'],
	['{{event.check_in | date: "%b %-d"}}', 'Oct 9'],
	['{{event.check_out | date: "%b %-d"}}', 'Oct 13'],
	['{{event.check_in | date: "%A %-d %B"}}', 'Friday 9 October'],
	['{{event.check_out | date: "%A %-d %B"}}', 'Tuesday 13 October'],
	['{{event.booking_id}}', 'WCS-2417'],
	['{{event.nights}}', '4'],
	['{{event.nightly_rate | money}}', '$289.00'],
	['{{event.accommodation_total | money}}', '$1,156.00'],
	['{{event.cleaning_fee | money}}', '$150.00'],
	['{{event.taxes | money}}', '$167.42'],
	['{{event.total | money}}', '$1,473.42'],
	['{{event.manage_url}}', '#'],
	['{{event.resume_url}}', '#'],
	['{% unsubscribe_url %}', '#'],
];

mkdirSync('preview', { recursive: true });
for (const name of ['booking-confirmation', 'abandoned-checkout']) {
	let html = readFileSync(`dist/${name}.html`, 'utf8');
	for (const [token, value] of SAMPLE) html = html.split(token).join(value);
	// Resolve {% if %}...{% else %}...{% endif %} to the else branch for preview.
	html = html.replace(
		/\{%\s*if[^%]*%\}[\s\S]*?\{%\s*else\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g,
		'$1',
	);
	const leftover = html.match(/\{\{[^}]*\}\}|\{%[^%]*%\}/g);
	if (leftover) {
		console.error(`${name}: unsubstituted tokens:`, [...new Set(leftover)]);
		process.exitCode = 1;
	}
	writeFileSync(`preview/${name}.html`, html);
	console.log(`preview/${name}.html written`);
}
