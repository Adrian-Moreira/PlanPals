class AccommodationValidator {

  static String? validateDates(DateTime? start, DateTime? end) {

    String? message;

    if (start == null || end == null) {
      message = "Please select both check-in and check-out dates.";
    }

    if (start!.isAfter(end!)) {
      message = "Make sure check-in is before check-out date.";
    }

    if (start.isBefore(DateTime.now())) {
      message = "Make sure the dates are valid.";
    }

    return message;
  }

}