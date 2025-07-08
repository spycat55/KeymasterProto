package utils_go

import (
	"errors"

	v1 "proto/go"

	ec "github.com/bsv-blockchain/go-sdk/primitives/ec"
	hash "github.com/bsv-blockchain/go-sdk/primitives/hash"
	"google.golang.org/protobuf/proto"
)

// VerifyEnvelope returns nil if signature valid else error.
func VerifyEnvelope(env *v1.Envelope) error {
	if env.SignatureAlgo != "ECDSA_SECP256K1_SHA256" {
		return errors.New("unsupported signature_algo")
	}
	pubKeyBytes := env.GetHeader().GetFromPubkey()
	if len(pubKeyBytes) == 0 {
		return errors.New("missing from_pubkey")
	}
	pub, err := ec.ParsePubKey(pubKeyBytes)
	if err != nil {
		return err
	}
	// rebuild input
	clone := proto.Clone(env).(*v1.Envelope)
	clone.Signature = nil
	clone.SignatureAlgo = ""
	b, err := DeterministicMarshal(clone)
	if err != nil {
		return err
	}
	digest := hash.Sha256(b)

	sig, err := ec.FromDER(env.Signature)
	if err != nil {
		return err
	}
	if !sig.Verify(digest, pub) {
		return errors.New("signature invalid")
	}
	return nil
}
