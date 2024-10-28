import 'package:flutter/material.dart';
import 'package:planpals/features/vote/vote_service.dart';

class VoteViewModel extends ChangeNotifier {
  final VoteService _voteService = VoteService();

  // State variables


  // GET


  // **Description:**
  // This function checks the voting status of a user on a specific object.
  //
  // **Parameters:**
  // - `userId`: The ID of the user.
  // - `objectId`: The ID of the object.
  // - `type`: The type of the object.
  //
  // **Returns:**
  // A [Future<Map<String, dynamic>>] containing the voting status:
  // - `upvoted`: true if the user upvoted the object.
  // - `downvoted`: true if the user downvoted the object.
  Future<Map<String, dynamic>> checkUserVoted(String userId, String objectId, String type) async {
  
  }

  
  
}