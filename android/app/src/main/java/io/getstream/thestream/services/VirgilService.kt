package io.getstream.thestream.services

import android.content.Context
import com.virgilsecurity.android.common.exception.EThreeException
import com.virgilsecurity.android.common.model.EThreeParams
import com.virgilsecurity.android.common.model.Group
import com.virgilsecurity.android.ethree.interaction.EThree


object VirgilService {
    private lateinit var userTimelineGroup: Group
    private lateinit var eThree: EThree

    fun init(context: Context, user: String) {
        val params = EThreeParams(user, BackendService::getVirgilToken, context)
        eThree = EThree(params)

        try {
            eThree.register().execute()
        } catch (e: EThreeException) {
            if (e.description != EThreeException.Description.USER_IS_ALREADY_REGISTERED) {
                // if user is already registered, we can safely ignore, otherwise rethrow
                throw e
            }
        }

        val otherUsers = BackendService.getUsers()
        val userCards = eThree.findUsers(otherUsers).get()
        userTimelineGroup = eThree.createGroup("feed-group-${user}", userCards).get()
    }

    fun encrypt(text: String): String {
        return userTimelineGroup.encrypt(text)
    }

    fun decrypt(text: String, timelineOwner: String): String {
        val otherUserCard = eThree.findUser(timelineOwner).get()
        val otherTimelineGroup =
            eThree.loadGroup("feed-group-${timelineOwner}", otherUserCard).get()
        return otherTimelineGroup.decrypt(text, otherUserCard)
    }
}