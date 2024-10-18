import 'package:flutter/material.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class DateForm extends StatelessWidget {
  final DateTime? initialDate;
  final Function(DateTime) dateSelected;
  final String labelText;
  final String placeholder;

  const DateForm({
    super.key,
    required this.dateSelected,
    this.initialDate,
    required this.labelText,
    required this.placeholder,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        // Open the date picker
        DateTime? pickedDate =
            await DateTimeSelector.selectDate(context, initialDate);
        if (pickedDate != null) {
          // Call the callback with the selected date
          dateSelected(pickedDate);
        }
      },
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: labelText,
        ),
        child: Row(
          children: <Widget>[
            Expanded(
              child: Text(
                initialDate == null
                    ? placeholder
                    : DateTimeFormat.formatDate(initialDate!),
                style: const TextStyle(fontSize: 16),
              ),
            ),
            const Icon(Icons.calendar_today), // Show an icon indicating it's clickable
          ],
        ),
      ),
    );
  }
}
