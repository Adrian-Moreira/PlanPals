import 'package:flutter/material.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class DateTimeForm extends StatelessWidget {
  final DateTime? initialDate;
  final Function(DateTime) dateTimeSelected;
  final String labelText;
  final String placeholder;

  const DateTimeForm(
      {super.key,
      required this.dateTimeSelected,
      this.initialDate,
      required this.labelText,
      required this.placeholder});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        DateTime? pickedDate =
            await DateTimeSelector.selectDate(context, initialDate);
        if (pickedDate != null) {
          TimeOfDay? pickedTime = await showTimePicker(
              context: context, 
              initialTime: TimeOfDay.fromDateTime(initialDate ?? DateTime.now()),
              initialEntryMode: TimePickerEntryMode.input,
              );
          if (pickedTime != null) {
            final selectedDateTime =
                DateTimeSelector.combineDateTime(pickedDate, pickedTime);
            dateTimeSelected(selectedDateTime);
          }
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
                    : DateTimeFormat.formatDateTime(initialDate!),
                style: const TextStyle(fontSize: 16),
              ),
            ),
            const Icon(
                Icons.calendar_today), // Show an icon indicating it's clickable
          ],
        ),
      ),
    );
  }
}
