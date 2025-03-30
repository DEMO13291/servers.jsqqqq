const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const token = 'MTM1NjAxNzI3NDUwNjU4MDIxOQ.Gu2EVl.tdJvSNzLFQWtf8Z0y_WVNb2CHDAGT_doeadsNY';
const API_URL = 'https://servers-jsqqqq.vercel.app/server.js'; // e.g., 'http://localhost:3000/api/status'

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Define slash commands: /online, /offline, /testing
const commands = [
  new SlashCommandBuilder().setName('online').setDescription('Set status to Online'),
  new SlashCommandBuilder().setName('offline').setDescription('Set status to Offline'),
  new SlashCommandBuilder().setName('testing').setDescription('Set status to Testing')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Listen for slash command interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  const commandName = interaction.commandName; // online, offline, or testing

  // Check if the user has the "OWNER" role
  // (Note: the member object is only available in guild interactions)
  if (!interaction.member.roles.cache.some(role => role.name === "OWNER")) {
    await interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
    return;
  }
  
  // Send a POST request to update the status via the API
  try {
    await axios.post(API_URL, { status: commandName });
    await interaction.reply({ content: `Status updated to ${commandName}.`, ephemeral: true });
  } catch (error) {
    console.error('Error updating status:', error);
    await interaction.reply({ content: `Error updating status: ${error.message}`, ephemeral: true });
  }
});

client.login(token);
