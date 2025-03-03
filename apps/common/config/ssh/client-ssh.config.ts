import * as fs from 'fs';
import * as net from 'net';
import { Client } from 'ssh2';
import { execSync } from 'child_process';
import { ConfigService } from '@nestjs/config';


export function getSSHConfig(configService: ConfigService) {
    return {
        sshKeyPath: configService.get<string>('SSH_KEY_PATH'),
        sshHost: configService.get<string>('SSH_HOST'),
        sshUser: configService.get<string>('SSH_USER'),
        remoteDbHost: configService.get<string>('REMOTE_DB_HOST'),
        localPort: Number(configService.get<number>('LOCAL_PORT')) || 3316,
        remotePort: Number(configService.get<number>('REMOTE_PORT')) || 3306,
    };
}

export function ensureSSHAgentRunning() {
    try {
        // Check if ssh-agent is already running
        const agentCheck = execSync('pgrep ssh-agent || echo "not running"').toString().trim();

        console.log(agentCheck)
        if (agentCheck === 'not running') {
            console.log('🔄 Starting SSH Agent...');
            execSync('eval "$(ssh-agent -s)"', { stdio: 'inherit' });
        } else {
            console.log('✅ SSH Agent is already running.');
        }
    } catch (error) {
        console.error('❌ Error starting SSH Agent:', error);
    }
}

export function addSSHKeyToAgent(sshKeyPath: string) {
    try {
        console.log('🔑 Checking if SSH Key is already added...');
        const keys = execSync('ssh-add -l || echo "no keys"').toString();
        if (!keys.includes(sshKeyPath)) {
            console.log('🔑 Adding SSH Key to Agent...');
            execSync(`nohup ssh-add ${sshKeyPath}`, { stdio: 'inherit' });
        } else {
            console.log('✅ SSH Key is already added.');
        }
    } catch (error) {
        console.error('❌ Error Adding SSH Key:', error);
        process.exit(1);
    }
}

export function establishSSHTunnel(sshConfig, onReadyCallback) {
    const sshClient = new Client();

    sshClient.on('ready', () => {
        console.log('✅ SSH Tunnel established successfully.');

        sshClient.forwardOut('127.0.0.1', sshConfig.localPort, sshConfig.remoteDbHost, sshConfig.remotePort, (err, stream) => {
            if (err) {
                console.error('❌ SSH Tunnel Forwarding Error:', err);
                return sshClient.end();
            }
            console.log(`✅ Port forwarding from 127.0.0.1:${sshConfig.localPort} to ${sshConfig.remoteDbHost}:${sshConfig.remotePort} is active.`);
            waitForTunnelToBeReady(sshConfig.localPort, onReadyCallback);
        });
    });

    sshClient.on('error', (err) => {
        console.error('❌ SSH Client Error:', err);
        process.exit(1);
    });

    sshClient.on('close', () => {
        console.error('⚠️ SSH Tunnel closed. Reconnecting...');
        setTimeout(() => establishSSHTunnel(sshConfig, onReadyCallback), 5000);
    });

    sshClient.connect({
        host: sshConfig.sshHost,
        port: 22,
        username: sshConfig.sshUser,
        privateKey: fs.readFileSync(sshConfig.sshKeyPath),
        keepaliveInterval: 10000,
        keepaliveCountMax: 10
    });
}

export function waitForTunnelToBeReady(port: number, callback: () => void) {
    console.log(`⏳ Waiting for SSH tunnel on port ${port} to be ready...`);

    const interval = setInterval(() => {
        const socket = net.connect(port, '127.0.0.1', () => {
            console.log(`✅ SSH Tunnel is now ready on port ${port}.`);
            socket.end();
            clearInterval(interval);
            callback();
        });

        socket.on('error', () => {
            console.log(`⏳ Still waiting for SSH tunnel on port ${port}...`);
        });
    }, 1000);
}
