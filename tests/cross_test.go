package tests

import (
	"os"
	"os/exec"
	"path/filepath"
	"testing"

	v1 "proto/go"
	utils "proto/utils_go"

	ec "github.com/bsv-blockchain/go-sdk/primitives/ec"
	"google.golang.org/protobuf/proto"
)

func TestCross_TS_Sign_Go_Verify(t *testing.T) {
	if _, err := exec.LookPath("bun"); err != nil {
		t.Skip("bun not installed")
	}
	tmp := filepath.Join(t.TempDir(), "ts.bin")
	cmd := exec.Command("bun", "./ts_sign.ts", tmp)
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("bun ts_sign failed: %v %s", err, string(out))
	}
	b, _ := os.ReadFile(tmp)
	var env v1.Envelope
	if err := proto.Unmarshal(b, &env); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	if err := utils.VerifyEnvelope(&env); err != nil {
		t.Fatalf("verify failed: %v", err)
	}
}

func TestCross_Go_Sign_TS_Verify(t *testing.T) {
	if _, err := exec.LookPath("bun"); err != nil {
		t.Skip("bun not installed")
	}
	tmp := filepath.Join(t.TempDir(), "go.bin")
	// generate env
	priv, _ := ec.NewPrivateKey()
	env := &v1.Envelope{
		Version: 1,
		Header: &v1.Header{
			Kind:       v1.MsgKind_KIND_WS_SIGNALING,
			MessageId:  "abc",
			FromPubkey: priv.PubKey().Compressed(),
			ToPubkey:   []byte{},
		},
		Payload: &v1.Envelope_WsSignaling{WsSignaling: &v1.WSSignaling{SignalingType: "offer", Data: []byte("hi")}},
	}
	if err := utils.SignEnvelope(env, priv); err != nil {
		t.Fatalf("sign: %v", err)
	}
	b, _ := proto.Marshal(env)
	os.WriteFile(tmp, b, 0644)

	cmd := exec.Command("bun", "./ts_verify.ts", tmp)
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("ts verify failed: %v %s", err, string(out))
	}
}
