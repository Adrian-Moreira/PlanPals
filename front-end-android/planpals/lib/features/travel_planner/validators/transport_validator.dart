class TransportValidator {

  static String? validateDates(DateTime? depart, DateTime? arrive) {

    String? message;

    if (depart == null || arrive == null) {
      message = "Please select both departure and arrival dates.";
    }

    if (depart!.isAfter(arrive!)) {
      message = "Make sure departure date is before arrival date.";
    }

    if (depart.isBefore(DateTime.now())) {
      message = "Make sure the dates are valid.";
    }

    return message;
  }
}