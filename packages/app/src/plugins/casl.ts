import Vue from 'vue'
import { abilitiesPlugin } from '@casl/vue'
import { defineAbilityFor } from './caslAbility'
import { authModule } from '@/store'

export const ability = defineAbilityFor(authModule.user)

Vue.use(abilitiesPlugin, ability)
