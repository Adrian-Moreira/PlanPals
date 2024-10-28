import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/update/update_transport_form.dart';
import 'package:planpals/shared/components/delete_message.dart';
import 'package:planpals/shared/components/generic_list_tile.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:provider/provider.dart';

class TransportCard extends StatelessWidget {
  final Transport transport;
  final bool functional;

  const TransportCard(
      {super.key, required this.transport, required this.functional});

  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel =
        Provider.of<PlannerViewModel>(context, listen: false);
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;

    return Card(
        child: GenericListTile(
            title: Text(transport.type,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                    'Departure: ${DateTimeFormat.formatDateTime(transport.departureTime)}'),
                Text(
                    'Arrival: ${DateTimeFormat.formatDateTime(transport.arrivalTime)}'),
              ],
            ),
            onDelete: () {
              showDialog(
                  context: context,
                  builder: (context) => DeleteMessage(onDelete: () {
                        // Delete Transport
                        plannerViewModel.deleteTransport(transport, user.id);
                      }));
            },
            onEdit: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      UpdateTransportForm(transport: transport),
                ),
              );
            }));
  }
}
