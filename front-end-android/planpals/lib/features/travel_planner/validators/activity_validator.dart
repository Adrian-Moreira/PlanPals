class ActivityValidator {

  static String? validateDates(DateTime? start, DateTime? end) {

    String? message;

    if (start == null || end == null) {
      message = "Please select both start and end dates.";
    }

    if (start!.isAfter(end!)) {
      message = "Make sure start date is before end date.";
    }

    if (start.isBefore(DateTime.now())) {
      message = "Make sure the dates are valid.";
    }

    return message;
  }
}
