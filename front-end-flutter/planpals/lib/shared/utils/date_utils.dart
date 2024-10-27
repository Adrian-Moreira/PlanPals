import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DateTimeFormat {
  static String formatDateTime(DateTime dateTime) {
<<<<<<< HEAD:front-end-android/planpals/lib/shared/utils/date_utils.dart
    DateFormat formatter = DateFormat('MMM d, h:mm a');
=======
    DateFormat formatter = DateFormat('MMMM d, h:mm a');
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/shared/utils/date_utils.dart
    String formatted = formatter.format(dateTime);
    return formatted.trim();
  }

  static String formatDate(DateTime datetime) {
    DateFormat formatter = DateFormat('MMMM d');
    String formatted = formatter.format(datetime);
    return formatted.trim();
  }

  static String formatTime(DateTime datetime) {
    DateFormat formatter = DateFormat('h:mm a');
    String formatted = formatter.format(datetime);
    return formatted.trim();
  }
}

class DateTimeToIso {

  static String formatDate(DateTime dateTime) {
    DateFormat formatter = DateFormat('yyyy-MM-dd');
    String formatted = formatter.format(dateTime);
    return formatted.trim();
  }

  static String formatToUtcIso(DateTime dateTime) {
    // Convert DateTime to UTC and format it in ISO 8601, adding the 'Z' suffix
    String isoString = dateTime.toUtc().toIso8601String();
    return '${isoString.substring(0, 19)}Z'; // Trim milliseconds and add 'Z'
  }
}

class DateTimeSelector {
  static Future<DateTime?> selectDate(
      BuildContext context, DateTime? initialDate) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    return pickedDate;
  }

  static Future<TimeOfDay?> selectTime(
      BuildContext context, TimeOfDay? initialTime) async {
    final TimeOfDay? pickedTime = await showTimePicker(
      context: context,
      initialTime: initialTime ?? TimeOfDay.now(),
    );
    return pickedTime;
  }

  static DateTime combineDateTime(DateTime date, TimeOfDay time) {
    return DateTime(
      date.year,
      date.month,
      date.day,
      time.hour,
      time.minute,
    );
  }
}
