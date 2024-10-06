import 'package:intl/intl.dart';

String formatDateTime( DateTime dateTime ) {
  DateFormat formatter = DateFormat('MMM d, h:mm a');
  String formatted = formatter.format(dateTime);
  return formatted.trim();
}

String getDate( DateTime datetime ) {
  DateFormat formatter = DateFormat('MMM d');
  String formatted = formatter.format(datetime);
  return formatted.trim();
}

String getTime( DateTime datetime ) {
  DateFormat formatter = DateFormat('h:mm a');
  String formatted = formatter.format(datetime);
  return formatted.trim();
}

